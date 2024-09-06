import stringWidth from "string-width";

export default function smartPad(str: string, length: number): string {
  const underlength = length - stringWidth(str);

  if (underlength <= 0) {
    return str;
  }

  return str + " ".repeat(underlength);
}
