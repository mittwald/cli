import { ContextMap } from "./context.js";

export default interface ContextProvider {
  name: string;

  getOverrides(): Promise<ContextMap>;
}
