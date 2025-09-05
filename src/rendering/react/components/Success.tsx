import React, { FC, PropsWithChildren } from "react";
import { Box, Text } from "ink";
import useDefaultBoxStyles from "../styles/useDefaultBoxStyles.js";

interface Props {
  title?: string;
  color?: string;
  innerText?: boolean;
}

export const defaultSuccessColor = "#00B785";

export const Success: FC<PropsWithChildren<Props>> = (props) => {
  const {
    title = "Success",
    color = defaultSuccessColor,
    innerText = true,
  } = props;

  const inner = innerText ? (
    <Text wrap="wrap" color={color}>
      {props.children}
    </Text>
  ) : (
    props.children
  );

  const defaultBoxStyles = useDefaultBoxStyles();

  return (
    <Box {...defaultBoxStyles} borderColor={color} flexDirection="column">
      <Text bold underline color={color}>
        {title.toUpperCase()}
      </Text>
      {inner}
    </Box>
  );
};
