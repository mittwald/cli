import { ReactNode } from "react";
import { Header } from "./Header.js";
import { Box, Text } from "ink";

export interface SingleResultProps {
  title: string;
  rows: Record<string, ReactNode>;
}

export function SingleResult<T>({ title, rows }: SingleResultProps) {
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
      <Box marginY={1}>
        <Header title={title} />
      </Box>
      {renderedRows}
    </Box>
  );
}
