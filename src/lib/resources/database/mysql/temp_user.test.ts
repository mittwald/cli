import { describe, it, expect } from "@jest/globals";
import { generateRandomPassword } from "./temp_user.js";

describe("generateRandomPassword", () => {
  it("should generate a password of the specified length", () => {
    const length = 12;
    const password = generateRandomPassword(length);
    expect(password.length).toBe(length);
  });

  it("should include at least one lowercase character", () => {
    const password = generateRandomPassword(12);
    expect(/[a-z]/.test(password)).toBe(true);
  });

  it("should include at least one uppercase character", () => {
    const password = generateRandomPassword(12);
    expect(/[A-Z]/.test(password)).toBe(true);
  });

  it("should include at least one digit", () => {
    const password = generateRandomPassword(12);
    expect(/[0-9]/.test(password)).toBe(true);
  });

  it("should include at least one special character", () => {
    const specialChars = "#!~%^*_+-=?{}()<>|.,;";
    const password = generateRandomPassword(12);
    expect(
      new RegExp(
        `[${specialChars.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}]`,
      ).test(password),
    ).toBe(true);
  });

  it("should generate passwords that are unique", () => {
    const password1 = generateRandomPassword(12);
    const password2 = generateRandomPassword(12);
    expect(password1).not.toBe(password2);
  });

  it("should work for passwords with length greater than 8", () => {
    const password = generateRandomPassword(20);
    expect(password.length).toBe(20);
    expect(/[a-z]/.test(password)).toBe(true);
    expect(/[A-Z]/.test(password)).toBe(true);
    expect(/[0-9]/.test(password)).toBe(true);
    const specialChars = "#!~%^*_+-=?{}()<>|.,;";
    expect(
      new RegExp(
        `[${specialChars.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}]`,
      ).test(password),
    ).toBe(true);
  });
});
