import { Command, Interfaces } from "@oclif/core";
import { BaseCommand } from "./BaseCommand.js";
import {
  ListColumns,
  ListFormatter,
  ListOptions,
} from "../../rendering/formatter/ListFormatter.js";
import { assertStatus, Response } from "@mittwald/api-client-commons";
import { ExtendedBaseCommand } from "./ExtendedBaseCommand.js";
import { SuccessfulResponse } from "../apiutil/SuccessfulResponse.js";
import ListDateColumnFormatter, {
  isResourceWithCreatedAt,
} from "../../rendering/formatter/ListDateColumnFormatter.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof ListBaseCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

export type ColumnOpts<TItem> = {
  shortIdKey?: keyof TItem;
  outputFormat?: string;
};

export type SorterFunction<TItem> = (a: TItem, b: TItem) => number;

export abstract class ListBaseCommand<
  T extends typeof BaseCommand,
  TItem extends Record<string, unknown>,
  TAPIResponse extends Response,
> extends ExtendedBaseCommand<T> {
  static baseFlags = {
    ...ExtendedBaseCommand.baseFlags,
    ...ListFormatter.flags,
  };

  protected formatter: ListFormatter = new ListFormatter();
  protected sorter?: SorterFunction<TItem>;

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
    let data: TItem[];

    if (!Array.isArray(response)) {
      assertStatus(response, 200);
      data = await this.mapData(response.data);
    } else {
      data = response;
    }

    this.formatter.log(data, this.getColumns(data), this.flags as ListOptions);
  }

  protected abstract getData(): Promise<TAPIResponse | TItem[]>;

  protected mapData(
    data: SuccessfulResponse<TAPIResponse, 200>["data"],
  ): TItem[] | Promise<TItem[]> {
    if (this.sorter !== undefined) {
      (data as TItem[]).sort(this.sorter);
    }

    return data as TItem[];
  }

  protected getColumns(
    data: TItem[],
    opts: ColumnOpts<TItem> = {},
  ): ListColumns<TItem> {
    const { shortIdKey = "shortId" } = opts;

    if (data.length === 0) {
      return {
        id: {
          header: "ID",
          exactWidth: 36,
        },
      };
    }
    // define some default columns, can be overwritten by child class
    let columns: ListColumns<TItem> = {
      id: {
        header: "ID",
        exactWidth: 36,
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
          exactWidth: 8,
        },
      };
    }

    if (isResourceWithCreatedAt(data[0])) {
      const createdAt = new ListDateColumnFormatter(this.flags).buildColumn();

      columns = {
        ...columns,
        createdAt,
      };
    }
    return columns;
  }
}
