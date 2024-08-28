import { generatePassword } from "../../lib/util/password/generatePassword.js";
import { Value } from "../../rendering/react/components/Value.js";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { Text } from "ink";

export async function generateRandomPassword(
  process: ProcessRenderer,
): Promise<string> {
  const generated = await process.runStep(
    "generating random password",
    async () => generatePassword(32),
  );

  process.addInfo(
    <Text>
      {" "}
      generated password: <Value>{generated}</Value>{" "}
    </Text>,
  );
  return generated;
}
