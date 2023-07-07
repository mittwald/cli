import React, { FC } from "react";
import { Box, Text } from "ink";

interface Props {
  rows: any[];
  columns?: string[];
}

// TODO: Dynamic columns and typed data
export const Table: FC<Props> = (props) => (
  <Box flexDirection="column" margin={1} gap={0} padding={0}>
    <Box margin={0} gap={1} padding={0}>
      <Box
        borderStyle="single"
        minWidth={38}
        padding={0}
        margin={0}
        borderBottom
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      >
        <Text bold>ID</Text>
      </Box>

      <Box
        borderStyle="single"
        width="50%"
        padding={0}
        margin={0}
        borderBottom
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      >
        <Text bold>Name</Text>
      </Box>

      <Box
        width="40%"
        borderStyle="single"
        padding={0}
        margin={0}
        borderBottom
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      >
        <Text bold>Status</Text>
      </Box>
    </Box>
    <Box flexDirection="column">
      {props.rows.map((p) => (
        <Box key={p.id} gap={1}>
          <Box minWidth={38} padding={0}>
            <Text>{p.id}</Text>
          </Box>

          <Box width="50%" padding={0}>
            <Text>{p.description}</Text>
          </Box>

          <Box width="40%" padding={0}>
            <Text>{p.readiness}</Text>
          </Box>
        </Box>
      ))}
    </Box>
    <Box marginTop={5}>
      <Text dimColor>Columns: {JSON.stringify(props.columns)}</Text>
    </Box>
  </Box>
);
