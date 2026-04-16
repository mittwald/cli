import { render } from "ink";
import { ErrorBox } from "./components/ErrorBox.js";

/**
 * Render an error to the terminal; see the ErrorBox component for details.
 *
 * @param err The error to render. May be anything; the ErrorBox component will
 *   handle it.
 */
export async function renderError(err: unknown): Promise<void> {
  const handle = render(<ErrorBox err={err} />);
  await handle.waitUntilExit();
}
