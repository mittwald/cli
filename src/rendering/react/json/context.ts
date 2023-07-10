import { createContext, useContext } from "react";
import { ObservableValue } from "../lib/observable-value/ObservableValue.js";

export type CollectedJsonData = Record<string, unknown>;

export const collectedJsonDataContext = createContext<
  ObservableValue<CollectedJsonData | undefined>
>(new ObservableValue(undefined));

export const useCollectedJsonData = (): ObservableValue<
  CollectedJsonData | undefined
> => useContext(collectedJsonDataContext);
