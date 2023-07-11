import React, { ComponentType, createElement, FC } from "react";
import { useCollectedJsonData } from "../json/context.js";
import { useWatchObservableValue } from "../lib/observable-value/useWatchObservableValue.js";
import { JSONView } from "./JSONView.js";
import { Box } from "ink";

interface Props {
  render: ComponentType;
}

export const RendererContainer: FC<Props> = (props) => {
  const { render } = props;
  const jsonValue = useCollectedJsonData();
  const json = useWatchObservableValue(jsonValue);

  const display = json ? "none" : "flex";

  return (
    <Box>
      <Box display={display}>{createElement(render)}</Box>
      <JSONView json={json} />
    </Box>
  );
};
