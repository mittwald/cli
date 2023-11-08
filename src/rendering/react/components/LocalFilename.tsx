import { FC } from "react";
import { Filename } from "./Filename.js";
import { getHomeDir } from "@oclif/core/lib/util/os.js";
import path from "path";

export const LocalFilename: FC<{ filename: string; relative?: boolean }> = ({
  filename,
  relative = false,
}) => {
  if (relative) {
    filename = path.relative(process.cwd(), filename);
  } else {
    filename = filename.replace(getHomeDir(), "~");
  }

  filename = filename.replace(process.cwd(), ".");

  return <Filename filename={filename} />;
};
