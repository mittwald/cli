import { FC, PropsWithChildren, useEffect, useId } from "react";
import { Dimension, useMeasureContext } from "./context.js";

export type OnDimensionChangedHandler = (dimension: Dimension) => void;

interface Props {
  onDimensionChange?: OnDimensionChangedHandler;
}

export const MeasureChildren: FC<PropsWithChildren<Props>> = (props) => {
  const { children, onDimensionChange } = props;
  const id = useId();
  const context = useMeasureContext();

  useEffect(() => {
    context.addNode(id, children);
    return () => {
      context.removeNode(id);
    };
  }, [context, children]);

  useEffect(
    () => context.getDimension(id).observe(onDimensionChange ?? (() => {})),
    [id, context, onDimensionChange],
  );

  return <>{children}</>;
};
