import ContextProvider from "./ContextProvider.js";
import { ContextMapUpdate } from "./Context.js";

/**
 * WritableContextProvider is a specialized ContextProvider that allows
 * modifying the context data.
 *
 * Implementations of this interface need some way to persist the changes to the
 * context data.
 */
interface WritableContextProvider extends ContextProvider {
  update(data: ContextMapUpdate): Promise<void>;

  reset(): Promise<void>;
}

export default WritableContextProvider;
