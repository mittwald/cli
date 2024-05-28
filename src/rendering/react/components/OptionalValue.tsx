import { ReactNode } from "react";
import { Value } from "./Value.js";

interface OptionalValueProps<T> {
  value: T | undefined | null;
  render?: (value: T) => ReactNode;
}

/**
 * Renders a value if it is set, otherwise renders a placeholder.
 *
 * @class
 * @param props
 */
function OptionalValue<T>(props: OptionalValueProps<T>) {
  const { render = (v) => <>{v}</> } = props;

  if (props.value === undefined || props.value === null) {
    return <Value notSet />;
  }

  return <Value>{render(props.value)}</Value>;
}

export default OptionalValue;
