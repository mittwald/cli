import { Command, Interfaces } from "@oclif/core";
import { BaseCommand } from "./BaseCommand.js";
import { ListColumns, ListFormatter } from "./Formatter.js";
import { assertStatus, Response } from "@mittwald/api-client-commons";
import { formatRelativeDate } from "./lib/viewhelpers/date.js";
import { SuccessfulResponse } from "./types.js";
import { ExtendedBaseCommand } from "./ExtendedBaseCommand.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof ListBaseCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

export type ColumnOpts<TItem> = {
  shortIdKey?: keyof TItem;
};

export abstract class ListBaseCommand<
  T extends typeof BaseCommand,
  TItem extends Record<string, unknown>,
  TAPIResponse extends Response,
> extends ExtendedBaseCommand<T> {
  static baseFlags = {
    ...ListFormatter.flags,
  };

  protected formatter: ListFormatter = new ListFormatter();

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof ListBaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.args = args as Args<T>;
    this.flags = flags as Flags<T>;
  }

  public async run(): Promise<void> {
    const response = await this.getData();

    assertStatus(response, 200);

    const data = await this.mapData(response.data);

    this.formatter.log(data, this.getColumns(data), { ...this.flags });
  }

  protected abstract getData(): Promise<TAPIResponse>;

  protected abstract mapData(
    data: SuccessfulResponse<TAPIResponse, 200>["data"],
  ): TItem[] | Promise<TItem[]>;

  protected getColumns(
    data: TItem[],
    opts: ColumnOpts<TItem> = {},
  ): ListColumns<TItem> {
    const { shortIdKey = "shortId" } = opts;

    if (data.length === 0) {
      return {
        id: {
          header: "ID",
          minWidth: 36,
        },
      };
    }
    // define some default columns, can be overwritten by child class
    let columns: ListColumns<TItem> = {
      id: {
        header: "ID",
        minWidth: 36,
      },
    };
    if (shortIdKey in data[0]) {
      // If there's a short ID in the data, the actual UUID becomes less useful,
      // so we hide it by default.
      columns.id.header = "UUID";
      columns.id.extended = true;

      columns = {
        ...columns,
        [shortIdKey]: {
          header: "ID",
          minWidth: 8,
        },
      };
    }
    if ("createdAt" in data[0]) {
      columns = {
        ...columns,
        createdAt: {
          header: "Created at",
          get: (row) => formatRelativeDate(new Date(`${row.createdAt}`)),
        },
      };
    }
    return columns;
  }
}
