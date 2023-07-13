import { ReactNode } from "react";
import { Header } from "./Header.js";
import { Box, Text } from "ink";

export interface SingleResultProps {
  title: ReactNode;
  rows: Record<string, ReactNode>;
}

export interface SingleResultTableProps {
  rows: Record<string, ReactNode>;
}

export function SingleResultTable({ rows }: SingleResultTableProps) {
  const maxColumnWidth = Object.keys(rows)
    .map((r) => r.length)
    .reduce((a, b) => Math.max(a, b), 0);
  const renderedRows = Object.keys(rows).map((key, idx) => {
    return (
      <Box flexDirection="row" key={idx}>
        <Box width={maxColumnWidth + 3}>
          <Text>{key}</Text>
        </Box>
        <Box>{rows[key]}</Box>
      </Box>
    );
  });

  return (
    <Box flexDirection="column">
      {renderedRows}
    </Box>
  );
}

export function SingleResult({ title, rows }: SingleResultProps) {
  return (
    <Box flexDirection="column">
      <Box marginY={1}>
        <Header title={title} />
      </Box>
      <SingleResultTable rows={rows} />
    </Box>
  );
}
