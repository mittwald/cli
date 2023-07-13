import { FC } from "react";

export const ByteFormat: FC<{ bytes: number }> = ({ bytes }) => {
  if (bytes > (1 << 30)) {
    return Math.round(bytes / (1 << 30)) + "Gi";
  }
  if (bytes > (1 << 20)) {
    return Math.round(bytes / (1 << 20)) + "Mi";
  }
  if (bytes > (1 << 10)) {
    return Math.round(bytes / (1 << 10)) + "Ki";
  }
  return bytes + "B";
}