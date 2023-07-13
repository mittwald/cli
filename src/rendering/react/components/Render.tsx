import { ComponentType, createElement, FC } from "react";

interface Props {
  render: ComponentType;
}

export const Render: FC<Props> = (props) => {
  const { render } = props;
  return createElement(render);
};
