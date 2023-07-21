import React, { FC } from "react";
import { Note, NoteProps } from "./Note.js";

export const warningColor = "#FF9343";
export const Warning: FC<NoteProps> = (props) => {
  const { title = "Warning", color = warningColor } = props;

  return <Note {...props} title={title} color={color} />;
};
