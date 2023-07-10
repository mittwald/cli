import { FC, useEffect } from "react";
import { useCollectedJsonData } from "./context.js";

interface Props {
  name: string;
  data: unknown;
}

export const RenderJson: FC<Props> = (props) => {
  const { name, data } = props;
  const jsonData = useCollectedJsonData();

  useEffect(() => {
    jsonData.updateValue({
      ...jsonData.value,
      [name]: data,
    });

    return () => {
      jsonData.updateValue({
        ...jsonData.value,
        [name]: undefined,
      });
    };
  }, [name, data, jsonData]);

  return null;
};
