import { Box } from "ink";
import React, { FC, PropsWithChildren } from "react";
import { useCollectedJsonData } from "./context.js";
import { useWatchObservableValue } from "../lib/observable-value/useWatchObservableValue.js";
import { JSONView } from "../components/JSONView.js";
import { unpackJsonData } from "./lib/unpackJsonData.js";

export const JsonRenderer: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const jsonValue = useCollectedJsonData();
  const json = useWatchObservableValue(jsonValue);
  const display = json ? "none" : "flex";
  const unpackedData = unpackJsonData(json);

  return (
    <Box>
      <Box display={display}>{children}</Box>
      <JSONView json={unpackedData} />
    </Box>
  );
};
