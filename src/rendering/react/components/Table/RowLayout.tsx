import React, { ComponentProps, FC, PropsWithChildren } from "react";
import { Box } from "ink";

export const RowLayout: FC<PropsWithChildren<ComponentProps<typeof Box>>> = (
  props,
) => <Box flexDirection="row" gap={1} {...props} />;
