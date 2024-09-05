import Table from "./Table.js";
import { expect } from "@jest/globals";

function effectiveStringLength(str: string) {
  const backspaceCount = (str.match(/[\b]/g) ?? []).length;
  return str.length - backspaceCount * 2;
}

describe("Table", () => {
  it("should spread a single column across the max width", () => {
    const t = new Table(
      {
        a: {
          header: "A",
        },
      },
      { maxWidth: 20, chalkOptions: { level: 0 } },
    );

    const rendered = t.render([{ a: "Foo" }, { a: "Bar" }]);

    expect(rendered).toMatchSnapshot();
    expect(rendered.split("\n")[0].length).toBe(20);
  });

  it("should truncate too long values using backspaces", () => {
    const t = new Table(
      {
        a: {
          header: "A",
        },
      },
      { maxWidth: 20, chalkOptions: { level: 0 } },
    );

    const rendered = t.render([
      { a: "Foo".repeat(10) },
      { a: "Bar".repeat(10) },
    ]);

    const lines = rendered.split("\n");

    expect(rendered).toMatchSnapshot();
    expect(lines[0].length).toBe(20);
    expect(effectiveStringLength(lines[2])).toBe(20);
  });
});
