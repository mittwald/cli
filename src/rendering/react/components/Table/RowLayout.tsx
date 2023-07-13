import React, { ComponentProps, FC, PropsWithChildren } from "react";
import { Box } from "ink";

type Props = PropsWithChildren<ComponentProps<typeof Box>>;

export const RowLayout: FC<Props> = (props) => (
  <Box flexDirection="row" gap={1} {...props} />
);
