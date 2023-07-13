import React, { FC } from "react";
import { Text } from "ink";

interface Props {
  json: unknown;
  inline?: boolean;
}

export const JSONView: FC<Props> = (props) =>
  props.json === undefined ? null : (
    <Text>
      {JSON.stringify(props.json, undefined, props.inline ? undefined : 2)}
    </Text>
  );
