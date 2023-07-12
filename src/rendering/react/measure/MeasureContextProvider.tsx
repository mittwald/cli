import { Box } from "ink";
import { FC, PropsWithChildren, useRef } from "react";
import { createMeasureContext, measureContext } from "./context.js";
import { MeasureRenderer } from "./MeasureRenderer.js";

export const MeasureContextProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const context = useRef(createMeasureContext()).current;

  return (
    <measureContext.Provider value={context}>
      <Box flexDirection="column" gap={1}>
        <Box>
          <MeasureRenderer />
        </Box>
        <Box>{children}</Box>
      </Box>
    </measureContext.Provider>
  );
};
