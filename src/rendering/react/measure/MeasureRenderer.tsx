import { Box, DOMElement, measureElement } from "ink";
import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { useWatchObservableValue } from "../lib/observable-value/useWatchObservableValue.js";
import { useMeasureContext } from "./context.js";

const M: FC<PropsWithChildren<{ id: string }>> = (props) => {
  const { children, id } = props;
  const measureContext = useMeasureContext();

  const ref = useRef<DOMElement>(null);

  useEffect(() => {
    if (ref.current) {
      const dimension = measureElement(ref.current);
      measureContext.updateDimension(id, dimension);
    }
  }, [id, measureContext, ref.current]);

  return (
    <Box height={0} overflow="hidden" flexShrink={1} ref={ref}>
      {children}
    </Box>
  );
};

export const MeasureRenderer: FC = () => {
  const context = useMeasureContext();
  const watchedNodes = useWatchObservableValue(context.nodes);

  return (
    <Box flexDirection="row" flexWrap="wrap">
      {Object.entries(watchedNodes).map(([id, node]) => (
        <M key={id} id={id}>
          {node}
        </M>
      ))}
    </Box>
  );
};
