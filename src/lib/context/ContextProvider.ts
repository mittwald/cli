import { ContextMap } from "./Context.js";

export default interface ContextProvider {
  name: string;

  getOverrides(): Promise<ContextMap>;
}
