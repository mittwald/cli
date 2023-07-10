import React from "react";
import { FC } from "react";
import { Text } from "ink";

interface Props {
  json: unknown;
}

export const JSONView: FC<Props> = (props) =>
  props.json === undefined ? null : (
    <Text>{JSON.stringify(props.json, undefined, 2)}</Text>
  );
