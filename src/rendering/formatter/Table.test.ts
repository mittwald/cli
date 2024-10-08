import Table from "./Table.js";
import { describe, expect, it } from "@jest/globals";
import TableColumnRenderer from "./TableColumnRenderer.js";

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
      new TableColumnRenderer({ maxWidth: 20, chalkOptions: { level: 0 } }),
    );

    const rendered = t.render([{ a: "Foo" }, { a: "Bar" }]);

    expect(rendered).toMatchSnapshot();
    expect(rendered.split("\n")[0].length).toBe(20);
  });

  it("should truncate too long values", () => {
    const t = new Table(
      {
        a: {
          header: "A",
        },
      },
      new TableColumnRenderer({ maxWidth: 20, chalkOptions: { level: 0 } }),
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

  it("should not truncate too long values when truncation is disabled", () => {
    const t = new Table(
      {
        a: {
          header: "A",
        },
      },
      new TableColumnRenderer({
        maxWidth: 20,
        chalkOptions: { level: 0 },
        truncate: false,
      }),
    );

    const rendered = t.render([
      { a: "Foo".repeat(20) },
      { a: "Bar".repeat(20) },
    ]);

    const lines = rendered.split("\n");

    expect(rendered).toMatchSnapshot();
    expect(lines[0].length).toBeGreaterThan(20);
    expect(effectiveStringLength(lines[2])).toBeGreaterThan(20);
  });

  it("should respect the minimum column width", () => {
    const t = new Table(
      {
        a: { minWidth: 15 },
        b: {},
      },
      new TableColumnRenderer({ maxWidth: 20, chalkOptions: { level: 0 } }),
    );

    const rendered = t.render([
      { a: "a", b: "b".repeat(20) },
      { a: "a", b: "b".repeat(20) },
    ]);

    expect(rendered).toMatchSnapshot();
  });

  it("should give expanding columns the remaining space", () => {
    const t = new Table(
      {
        a: { minWidth: 3 },
        b: { expand: true },
        c: { minWidth: 3 },
      },
      new TableColumnRenderer({ maxWidth: 20, chalkOptions: { level: 0 } }),
    );

    const rendered = t.render([
      { a: "aaa", b: "b".repeat(20), c: "ccc" },
      { a: "aaa", b: "b".repeat(20), c: "ccc" },
    ]);

    expect(rendered).toMatchSnapshot();
  });

  it("should still give non-expanding columns a bit more space if available", () => {
    const t = new Table(
      {
        a: { minWidth: 3 },
        b: { expand: true },
        c: {},
      },
      new TableColumnRenderer({ maxWidth: 40, chalkOptions: { level: 0 } }),
    );

    const rendered = t.render([
      { a: "aaa", b: "b".repeat(40), c: "ccc" },
      { a: "aaa", b: "b".repeat(40), c: "ccc" },
    ]);

    expect(rendered).toMatchSnapshot();
  });

  describe("without max width", () => {
    it("should give each column the maximum content width when no max width ", () => {
      const t = new Table(
        {
          a: { minWidth: 3 },
          b: { expand: true },
          c: {},
        },
        new TableColumnRenderer({
          maxWidth: undefined,
          chalkOptions: { level: 0 },
        }),
      );

      const rendered = t.render([
        { a: "aaa", b: "b".repeat(40), c: "ccc" },
        { a: "aaa", b: "b".repeat(40), c: "ccc" },
      ]);

      expect(rendered).toMatchSnapshot();
    });
  });
});
