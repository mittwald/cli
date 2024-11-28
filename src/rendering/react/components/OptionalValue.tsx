import { ReactNode } from "react";
import { Value } from "./Value.js";

interface OptionalValueProps<T extends ReactNode> {
  value: T | undefined | null;
  render?: (value: T) => ReactNode;
}

/**
 * Renders a value if it is set, otherwise renders a placeholder.
 *
 * @class
 * @param props
 */
function OptionalValue<T extends ReactNode>(props: OptionalValueProps<T>) {
  const { render = (v) => <>{v}</> } = props;

  if (props.value === undefined || props.value === null) {
    return <Value notSet />;
  }

  return <Value>{render(props.value)}</Value>;
}

export default OptionalValue;
