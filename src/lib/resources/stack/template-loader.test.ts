import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import {
  validateTemplateName,
  templateNameToRepoName,
  buildGitHubRawUrl,
  fetchTemplateFile,
  loadStackFromTemplate,
  TemplateFileNotFoundError,
  GitHubRateLimitError,
  TemplateNetworkError,
} from "./template-loader.js";
import axios from "axios";

describe("validateTemplateName", () => {
  it("should accept valid template names", () => {
    expect(() => validateTemplateName("mittwald/n8n")).not.toThrow();
    expect(() => validateTemplateName("owner/name")).not.toThrow();
    expect(() => validateTemplateName("my-org/my-app")).not.toThrow();
    expect(() => validateTemplateName("org_name/app_name")).not.toThrow();
  });

  it("should reject invalid template names", () => {
    expect(() => validateTemplateName("")).toThrow(/Invalid template name/);
    expect(() => validateTemplateName("noSlash")).toThrow(
      /Invalid template name/,
    );
    expect(() => validateTemplateName("too/many/slashes")).toThrow(
      /Invalid template name/,
    );
    expect(() => validateTemplateName("/missingOwner")).toThrow(
      /Invalid template name/,
    );
    expect(() => validateTemplateName("missingName/")).toThrow(
      /Invalid template name/,
    );
  });
});

describe("templateNameToRepoName", () => {
  it("should convert template name to repository name", () => {
    expect(templateNameToRepoName("mittwald/n8n")).toBe(
      "mittwald/stack-template-n8n",
    );
    expect(templateNameToRepoName("owner/app")).toBe(
      "owner/stack-template-app",
    );
  });
});

describe("buildGitHubRawUrl", () => {
  it("should build correct GitHub raw URL", () => {
    expect(buildGitHubRawUrl("mittwald/n8n", "docker-compose.yml")).toBe(
      "https://raw.githubusercontent.com/mittwald/stack-template-n8n/main/docker-compose.yml",
    );
    expect(buildGitHubRawUrl("owner/app", ".env")).toBe(
      "https://raw.githubusercontent.com/owner/stack-template-app/main/.env",
    );
  });
});

describe("fetchTemplateFile", () => {
  let axiosGetSpy: jest.SpiedFunction<typeof axios.get>;
  let axiosIsAxiosErrorSpy: jest.SpiedFunction<typeof axios.isAxiosError>;

  beforeEach(() => {
    axiosGetSpy = jest.spyOn(axios, "get") as jest.SpiedFunction<
      typeof axios.get
    >;
    axiosIsAxiosErrorSpy = jest.spyOn(
      axios,
      "isAxiosError",
    ) as jest.SpiedFunction<typeof axios.isAxiosError>;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should fetch file successfully", async () => {
    const mockData = "file content";
    axiosGetSpy.mockResolvedValue({ data: mockData } as never);

    const result = await fetchTemplateFile(
      "https://raw.githubusercontent.com/mittwald/stack-template-n8n/main/docker-compose.yml",
    );

    expect(result).toBe(mockData);
    expect(axiosGetSpy).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/mittwald/stack-template-n8n/main/docker-compose.yml",
      { responseType: "text", timeout: 10000 },
    );
  });

  it("should handle 404 errors", async () => {
    axiosGetSpy.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    } as never);
    axiosIsAxiosErrorSpy.mockReturnValue(true as never);

    await expect(
      fetchTemplateFile("https://example.com/missing.yml"),
    ).rejects.toThrow(TemplateFileNotFoundError);
  });

  it("should handle 403 rate limit errors", async () => {
    axiosGetSpy.mockRejectedValue({
      isAxiosError: true,
      response: { status: 403 },
    } as never);
    axiosIsAxiosErrorSpy.mockReturnValue(true as never);

    await expect(
      fetchTemplateFile("https://example.com/file.yml"),
    ).rejects.toThrow(GitHubRateLimitError);
  });

  it("should handle timeout errors", async () => {
    axiosGetSpy.mockRejectedValue({
      isAxiosError: true,
      code: "ETIMEDOUT",
    } as never);
    axiosIsAxiosErrorSpy.mockReturnValue(true as never);

    await expect(
      fetchTemplateFile("https://example.com/file.yml"),
    ).rejects.toThrow(TemplateNetworkError);
  });

  it("should handle network errors", async () => {
    axiosGetSpy.mockRejectedValue({
      isAxiosError: true,
      code: "ECONNREFUSED",
    } as never);
    axiosIsAxiosErrorSpy.mockReturnValue(true as never);

    await expect(
      fetchTemplateFile("https://example.com/file.yml"),
    ).rejects.toThrow(TemplateNetworkError);
  });
});

describe("loadStackFromTemplate", () => {
  let axiosGetSpy: jest.SpiedFunction<typeof axios.get>;
  let axiosIsAxiosErrorSpy: jest.SpiedFunction<typeof axios.isAxiosError>;

  beforeEach(() => {
    axiosGetSpy = jest.spyOn(axios, "get") as jest.SpiedFunction<
      typeof axios.get
    >;
    axiosIsAxiosErrorSpy = jest.spyOn(
      axios,
      "isAxiosError",
    ) as jest.SpiedFunction<typeof axios.isAxiosError>;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should load both docker-compose.yml and .env", async () => {
    const composeContent = "version: '3'\nservices:\n  app:\n    image: nginx";
    const envContent = "FOO=bar\nBAZ=qux";

    axiosGetSpy
      .mockResolvedValueOnce({ data: composeContent } as never)
      .mockResolvedValueOnce({ data: envContent } as never);

    const result = await loadStackFromTemplate("mittwald/n8n");

    expect(result.composeYaml).toBe(composeContent);
    expect(result.envContent).toBe(envContent);
  });

  it("should handle missing .env file gracefully", async () => {
    const composeContent = "version: '3'\nservices:\n  app:\n    image: nginx";

    axiosGetSpy.mockResolvedValueOnce({ data: composeContent } as never);
    axiosGetSpy.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 },
    } as never);
    axiosIsAxiosErrorSpy.mockReturnValue(true as never);

    const result = await loadStackFromTemplate("mittwald/n8n");

    expect(result.composeYaml).toBe(composeContent);
    expect(result.envContent).toBeNull();
  });

  it("should throw error if docker-compose.yml is missing", async () => {
    axiosGetSpy.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    } as never);
    axiosIsAxiosErrorSpy.mockReturnValue(true as never);

    await expect(loadStackFromTemplate("mittwald/n8n")).rejects.toThrow(
      /Template 'mittwald\/n8n' not found/,
    );
  });

  it("should validate template name before fetching", async () => {
    await expect(loadStackFromTemplate("invalid")).rejects.toThrow(
      /Invalid template name/,
    );

    expect(axiosGetSpy).not.toHaveBeenCalled();
  });
});
