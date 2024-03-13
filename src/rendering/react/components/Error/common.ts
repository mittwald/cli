import { BoxProps } from "ink";

const defaultErrorColor = "red";
export const issueURL = "https://github.com/mittwald/cli/issues/new";
export const defaultErrorBoxProps: BoxProps = {
  width: 80,
  flexDirection: "column",
  borderColor: defaultErrorColor,
  borderStyle: "round",
  paddingX: 1,
  rowGap: 1,
};
