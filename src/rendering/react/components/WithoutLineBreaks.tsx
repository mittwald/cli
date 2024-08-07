import { Text, Transform } from "ink";
import React, { FC, PropsWithChildren } from "react";
import { removeLineBreaks } from "../../textformat/removeLineBreaks.js";

export const WithoutLineBreaks: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <Transform transform={removeLineBreaks}>
      <Text>{children}</Text>
    </Transform>
  );
};
