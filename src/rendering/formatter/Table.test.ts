import Table from "./Table.js";
import { expect } from "@jest/globals";

describe("Table", () => {
  it("should spread a single column across the max width", () => {
    const t = new Table(
      {
        a: {
          header: "A",
        },
      },
      { maxWidth: 20 },
    );

    const rendered = t.render([
      {
        a: "Foo",
      },
      {
        a: "Bar",
      },
    ]);

    expect(rendered).toMatchSnapshot();
  });
});
