import axios, { AxiosError } from "axios";

export interface TemplateContent {
  composeYaml: string;
  envContent: string | null;
}

export class TemplateFileNotFoundError extends Error {
  constructor(url: string) {
    super(`File not found at ${url}`);
    this.name = "TemplateFileNotFoundError";
  }
}

export class GitHubRateLimitError extends Error {
  constructor() {
    super("GitHub API rate limit exceeded. Please try again later.");
    this.name = "GitHubRateLimitError";
  }
}

export class TemplateNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TemplateNetworkError";
  }
}

export function validateTemplateName(name: string): void {
  const validFormat = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
  if (!validFormat.test(name)) {
    throw new Error(
      `Invalid template name format: '${name}'. Expected format: 'owner/name' (e.g., 'mittwald/n8n')`,
    );
  }
}

export function templateNameToRepoName(templateName: string): string {
  const [owner, name] = templateName.split("/");
  return `${owner}/stack-template-${name}`;
}

export function buildGitHubRawUrl(
  templateName: string,
  filename: string,
): string {
  const repoName = templateNameToRepoName(templateName);
  return `https://raw.githubusercontent.com/${repoName}/main/${filename}`;
}

function convertAxiosError(error: unknown, url: string): Error {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error : new Error(String(error));
  }

  const axiosError = error as AxiosError;

  if (axiosError.response?.status === 404) {
    return new TemplateFileNotFoundError(url);
  }

  if (axiosError.response?.status === 403) {
    return new GitHubRateLimitError();
  }

  if (axiosError.code === "ETIMEDOUT") {
    return new TemplateNetworkError(
      "Request timed out while fetching template from GitHub",
    );
  }

  if (axiosError.code === "ECONNREFUSED" || axiosError.code === "ENOTFOUND") {
    return new TemplateNetworkError(
      "Network error: Unable to connect to GitHub. Please check your internet connection.",
    );
  }

  return error;
}

export async function fetchTemplateFile(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      responseType: "text",
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    throw convertAxiosError(error, url);
  }
}

export async function loadStackFromTemplate(
  templateName: string,
): Promise<TemplateContent> {
  validateTemplateName(templateName);

  const composeUrl = buildGitHubRawUrl(templateName, "docker-compose.yml");
  const envUrl = buildGitHubRawUrl(templateName, ".env");

  let composeYaml: string;
  try {
    composeYaml = await fetchTemplateFile(composeUrl);
  } catch (error) {
    if (error instanceof TemplateFileNotFoundError) {
      const repoName = templateNameToRepoName(templateName);
      throw new Error(
        `Template '${templateName}' not found. Repository '${repoName}' does not exist or does not contain a docker-compose.yml file.`,
      );
    }
    throw error;
  }

  let envContent: string | null = null;
  try {
    envContent = await fetchTemplateFile(envUrl);
  } catch (error) {
    if (error instanceof TemplateFileNotFoundError) {
      // .env file is optional, so we ignore 404 errors
      envContent = null;
    } else {
      throw error;
    }
  }

  return { composeYaml, envContent };
}
