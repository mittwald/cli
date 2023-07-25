import { render } from "ink";
import { ErrorBox } from "./components/ErrorBox.js";

export function renderError(err: unknown) {
  render(<ErrorBox err={err} />);
}
