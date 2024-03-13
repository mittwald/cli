import { Text, TextProps } from "ink";

export default function ErrorText(props: TextProps) {
  return (
    <Text color="red" {...props}>
      {props.children}
    </Text>
  );
}
