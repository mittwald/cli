import { Box, BoxProps } from "ink";
import { PropsWithChildren } from "react";

const defaultErrorBoxProps: BoxProps = {
  width: 80,
  flexDirection: "column",
  borderColor: "red",
  borderStyle: "round",
  paddingX: 1,
  rowGap: 1,
};

export default function ErrorBox(props: PropsWithChildren<BoxProps>) {
  return (
    <Box {...defaultErrorBoxProps} {...props}>
      {props.children}
    </Box>
  );
}
