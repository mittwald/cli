import React, { FC, PropsWithChildren, useRef } from "react";
import { collectedJsonDataContext } from "./context.js";
import { ObservableValue } from "../lib/observable-value/ObservableValue.js";
import { JsonRenderer } from "./JsonRenderer.js";

const ContextProvider = collectedJsonDataContext.Provider;

export const JsonCollectionProvider: FC<PropsWithChildren> = (props) => {
  const contextValue = useRef(new ObservableValue(undefined)).current;

  return (
    <ContextProvider value={contextValue}>
      <JsonRenderer>{props.children}</JsonRenderer>
    </ContextProvider>
  );
};
