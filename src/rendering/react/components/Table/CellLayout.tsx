import * as Model from "./model/index.js";
import { Box, Text } from "ink";
import React, { ComponentProps, FC, PropsWithChildren } from "react";
import { MeasureChildren } from "../../measure/MeasureChildren.js";
import { useWatchObservableValue } from "../../lib/observable-value/useWatchObservableValue.js";
import { WithoutLineBreaks } from "../WithoutLineBreaks.js";
import { useTableContext } from "./context.js";

interface Props extends ComponentProps<typeof Box> {
  col: Model.Column;
}

export const CellLayout: FC<PropsWithChildren<Props>> = (props) => {
  const { col, children, ...boxProps } = props;
  const proportionalWidth = useWatchObservableValue(col.proportionalWidth);

  const { setup } = useTableContext();
  const { noTruncate } = setup;

  if (!col.options.isVisible) {
    return null;
  }

  const wrap = noTruncate ? "wrap" : "truncate";

  return (
    <Box
      width={proportionalWidth}
      minWidth={col.options.minWidth}
      {...boxProps}
    >
      <MeasureChildren onDimensionChange={(dim) => col.notifyCellMeasured(dim)}>
        <Text wrap={wrap}>
          <WithoutLineBreaks>{children}</WithoutLineBreaks>
        </Text>
      </MeasureChildren>
    </Box>
  );
};
