import { getTerminalWidth } from "../lib/getTerminalWidth.js";

export type ListColumn<TItem> = {
    header?: string;
    extended?: boolean;
    get?: (row: TItem) => string | undefined;
    minWidth?: number;
};

export type ListColumns<TItem> = {
    [key: string]: ListColumn<TItem>;
};

export interface TableOptions {
    extended: boolean;
    truncate: boolean;
}

export default class Table<TItem> {
    private columns: ListColumns<TItem>;
    private opts: TableOptions;

    public constructor(columns: ListColumns<TItem>, opts: Partial<TableOptions>) {
        this.columns = columns;
        this.opts = {
            extended: false,
            truncate: true,
            ...opts,
        }
    }

    public render(data: TItem[]): string {
        const availableWidth = getTerminalWidth();
        const renderedItems: string[][] = [];

        const colList = Object.entries(this.columns).filter(([, spec]) => this.opts.extended ? true : !spec.extended);

        const reservedWidths = colList.map(([, spec]) => spec.minWidth || 0);
        const dynamicWidths = colList.map(() => 0);
        const reservedForColumnGaps = (colList.length - 1) * 2;

        for (let idx = 0; idx < data.length; idx ++) {
            const rendered = colList.map(([key, spec]) => {
                if (spec.get) {
                    return spec.get(data[idx]);
                }
                return (data[idx] as any)[key];
            });

            rendered.forEach((val, idx) => {
                dynamicWidths[idx] = Math.max(dynamicWidths[idx], colList[idx][1].minWidth ? 0 : val.length);
            });

            renderedItems.push(rendered);
        }

        const requiredWidth = dynamicWidths.reduce((prev, current) => prev + current, 0);
        const reservedWidthSum = reservedWidths.reduce((prev, current) => prev + current, 0);

        const definiteColWidths = colList.map(([, spec], idx) => {
            if (spec.minWidth) {
                return spec.minWidth;
            }

            if (availableWidth) {
                const allocatable = availableWidth - reservedWidthSum - reservedForColumnGaps;
                const fractionalWidth = dynamicWidths[idx] / requiredWidth;
                return Math.floor(allocatable * fractionalWidth);
            }

            return dynamicWidths[idx];
        });
        
        let output = "";

        const headerColumns = colList.map(([key, value]) => (value.header ?? key).toUpperCase());
        const truncatedHeaderColumns = headerColumns.map((val, idx) => val.substring(0, definiteColWidths[idx]));
        const paddedHeaderColumns = truncatedHeaderColumns.map((val, idx) => val + " ".repeat(definiteColWidths[idx] - val.length));

        output += paddedHeaderColumns.join("  ") + "\n";
        output += paddedHeaderColumns.map(v => "".repeat(v.length)).join("  ") + "\n";

        for (let idx = 0; idx < renderedItems.length; idx ++) {
            const truncatedRows = renderedItems[idx].map((val, colIdx) => val.substring(0, definiteColWidths[colIdx]));
            const paddedRows = truncatedRows.map((val, colIdx) => val + " ".repeat(definiteColWidths[colIdx] - val.length));

            output += paddedRows.join("  ") + "\n";
        }

        return output;
    }
}