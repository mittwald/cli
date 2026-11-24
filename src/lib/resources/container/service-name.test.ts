import { describe, expect, it } from "@jest/globals";
import { serviceNameFromDirectory } from "./service-name.js";

describe("serviceNameFromDirectory", () => {
  it("uses the base name of the directory", () => {
    expect(serviceNameFromDirectory("/home/user/projects/shop")).toBe("shop");
  });

  it("lowercases and replaces unsupported characters with dashes", () => {
    expect(serviceNameFromDirectory("/src/My Shop_v2.0")).toBe("my-shop-v2-0");
  });

  it("trims leading and trailing dashes", () => {
    expect(serviceNameFromDirectory("/src/__shop__")).toBe("shop");
  });

  it("limits the name to 63 characters", () => {
    const name = serviceNameFromDirectory(`/src/${"a".repeat(62)}_b`);
    expect(name).toBe("a".repeat(62));
  });

  it("returns undefined if no usable characters remain", () => {
    expect(serviceNameFromDirectory("/src/___")).toBeUndefined();
  });
});
