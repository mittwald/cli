import ContextProvider from "./ContextProvider.js";
import { ContextMapUpdate } from "./context.js";

export default interface WritableContextProvider extends ContextProvider {
  update(data: ContextMapUpdate): Promise<void>;

  reset(): Promise<void>;
}
