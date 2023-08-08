import { render } from "ink";
import { ErrorBox } from "./components/ErrorBox.js";

/**
 * Render an error to the terminal; see the ErrorBox component for details.
 *
 * @param err The error to render. May be anything; the ErrorBox component will
 *   handle it.
 */
export function renderError(err: unknown) {
  // render(<Text>{(err as any).message}</Text>);
  render(<ErrorBox err={err} />);
}
