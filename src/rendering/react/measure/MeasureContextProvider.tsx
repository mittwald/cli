import { Box } from "ink";
import {
  FC,
  PropsWithChildren,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createMeasureContext, measureContext } from "./context.js";
import { MeasureRenderer } from "./MeasureRenderer.js";

export const MeasureContextProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const context = useRef(createMeasureContext()).current;

  const [isMeasuring, setIsMeasuring] = useState(true);

  useLayoutEffect(() => {
    setIsMeasuring(false);
  }, []);

  return (
    <measureContext.Provider value={context}>
      <Box flexDirection="column" gap={1}>
        <Box>
          <MeasureRenderer />
        </Box>
        <Box
          height={isMeasuring ? 0 : undefined}
          overflow={isMeasuring ? "hidden" : undefined}
        >
          {children}
        </Box>
      </Box>
    </measureContext.Provider>
  );
};
