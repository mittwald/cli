import { Box, BoxProps } from "ink";
import { PropsWithChildren } from "react";
import useDefaultBoxStyles from "../../styles/useDefaultBoxStyles.js";

const defaultErrorBoxProps: BoxProps = {
  flexDirection: "column",
  borderColor: "red",
  rowGap: 1,
};

/** A pre-styled box for displaying errors. */
export default function ErrorBox(
  props: PropsWithChildren<Omit<BoxProps, "width">>,
) {
  const defaultBoxStyles = useDefaultBoxStyles();
  return (
    <Box {...defaultBoxStyles} {...defaultErrorBoxProps} {...props}>
      {props.children}
    </Box>
  );
}
