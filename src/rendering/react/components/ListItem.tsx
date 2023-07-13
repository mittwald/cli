import { PropsWithChildren } from "react";
import { Box, Text } from "ink";

export type ListItemProps = PropsWithChildren<{}>;

export function ListItem({ children }: ListItemProps) {
  return <Box flexDirection={"row"}>
    <Box width={2} marginRight={1}><Text>•</Text></Box>
    <Box>{children}</Box>
  </Box>
}