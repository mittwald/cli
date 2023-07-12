import * as Model from "./model/index.js";
import { Box, Text } from "ink";
import React, { ComponentProps, FC, PropsWithChildren } from "react";
import { MeasureChildren } from "../../measure/MeasureChildren.js";
import { useWatchObservableValue } from "../../lib/observable-value/useWatchObservableValue.js";
import { WithoutLineBreaks } from "../WithoutLineBreaks.js";

interface Props extends ComponentProps<typeof Box> {
  col: Model.Column;
}

export const CellContainer: FC<PropsWithChildren<Props>> = (props) => {
  const { col, children, ...boxProps } = props;
  const proportionalWidth = useWatchObservableValue(col.proportionalWidth);

  if (!col.options.isVisible) {
    return null;
  }

  return (
    <Box
      width={proportionalWidth}
      minWidth={col.options.minWidth}
      {...boxProps}
    >
      <MeasureChildren onDimensionChange={(dim) => col.notifyCellMeasured(dim)}>
        <Text wrap="truncate">
          <WithoutLineBreaks>{children}</WithoutLineBreaks>
        </Text>
      </MeasureChildren>
    </Box>
  );
};
