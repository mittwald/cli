import { FC } from "react";
import ByteQuantity from "../../../lib/units/ByteQuantity.js";

/**
 * Renders a byte quantity in a human-readable format.
 *
 * @deprecated Use `ByteQuantity.format()` instead.
 * @class
 * @param bytes
 */
export const ByteFormat: FC<{ bytes: ByteQuantity }> = ({ bytes }) => {
  return <>{bytes.format()}</>;
};
