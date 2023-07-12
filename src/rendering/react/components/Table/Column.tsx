import { ComponentProps, FC, ReactElement } from "react";
import { ColumnOptionsInput } from "./model/ColumnOptions.js";
import { ColumnOptionsInputMap } from "./model/index.js";

interface Props extends ColumnOptionsInput {
  name: string;
}

export const Column: FC<Props> = () => {
  return null;
};

export type ColumnElementType = ReactElement<ComponentProps<typeof Column>>;

export const getOptionsFromColumnElements = (
  elements: ColumnElementType[],
): ColumnOptionsInputMap =>
  Object.fromEntries(elements.map(({ props }) => [props.name, props] as const));
