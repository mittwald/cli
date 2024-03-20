import { Text, TextProps } from "ink";

/** A pre-styled text for displaying errors. */
export default function ErrorText(props: TextProps) {
  return (
    <Text color="red" {...props}>
      {props.children}
    </Text>
  );
}
