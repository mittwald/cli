import { ContextMap } from "./Context.js";

interface ContextProvider {
  name: string;

  getOverrides(): Promise<ContextMap>;
}

export default ContextProvider;
