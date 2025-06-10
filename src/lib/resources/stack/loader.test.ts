import { describe, expect, it } from "@jest/globals";
import { loadStackFromStr } from "./loader.js";

describe("loadStackFromStr", () => {
  it("should convert a stack YAML input to a stack definition", async () => {
    const input = `services:
  nginx:
    image: nginx
    ports:
      - 80:80
    environment:
      FOO: bar
    volumes:
      data:/var/www
volumes:
  data:`;

    const stack = await loadStackFromStr(input, {});

    expect(stack).toHaveProperty("services.nginx.image", "nginx");
  });

  it("interpolates environment variables in a stack definition", async () => {
    const input = `services:
  nginx:
    image: nginx:\${NGINX_VERSION}`;

    const stack = await loadStackFromStr(input, { NGINX_VERSION: "0.1.0" });

    expect(stack).toHaveProperty("services.nginx.image", "nginx:0.1.0");
  });

  it("interpolates environment variables with default values", async () => {
    const input = `services:
  nginx:
    image: nginx:\${NGINX_VERSION:-latest}`;

    const stack = await loadStackFromStr(input, {});

    expect(stack).toHaveProperty("services.nginx.image", "nginx:latest");
  });

  it("interpolates environment variables with default values for non-empty variables", async () => {
    const input = `services:
  nginx:
    image: nginx
    environment:
      FOO: \${FOO:-foo}`;

    const stack = await loadStackFromStr(input, { FOO: "" });

    expect(stack).toHaveProperty("services.nginx.environment.FOO", "foo");
  });

  it("interpolates environment variables with default values for empty variables", async () => {
    const input = `services:
  nginx:
    image: nginx
    environment:
      FOO: \${FOO-foo}`;

    const stack = await loadStackFromStr(input, { FOO: "" });

    expect(stack).toHaveProperty("services.nginx.environment.FOO", "");
  });
});
