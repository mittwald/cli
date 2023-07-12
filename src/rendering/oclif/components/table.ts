import { formatDate } from "../../../lib/viewhelpers/date.js";
import { ux } from "@oclif/core";
import { TableRenderSetupOutput } from "../../setup/TableRenderSetup.js";

export class Table {
  private readonly rows: any[];
  private readonly columns?: string[];

  constructor(rows: any[], setup: TableRenderSetupOutput) {
    this.rows = rows;
    this.columns = setup.visibleColumns;
  }

  public static build(rows: any[], setup: TableRenderSetupOutput): Table {
    return new Table(rows, setup);
  }

  public render(): void {
    const columns = {
      id: {
        header: "ID",
        minWidth: 36,
      },
      shortId: {
        header: "Short ID",
        minWidth: 8,
      },
      customerId: {
        header: "Customer ID",
        extended: true,
      },
      description: {
        header: "Description",
      },
      status: {
        header: "Status",
        get: (row: any) => {
          if (!row.enabled) {
            return "disabled";
          }
          return row.readiness;
        },
      },
      createdAt: {
        header: "Created at",
        get: (row: any) => formatDate(new Date(`${row.createdAt}`)),
      },
    };

    ux.table(this.rows, columns, {
      printLine: console.log,
      columns: this.columns?.join(","),
    });
  }
}
