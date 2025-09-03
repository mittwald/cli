import { generatePassword } from "../../util/password/generatePassword.js";
import { ProcessRenderer } from "../../../rendering/process/process.js";

export async function generateRandomPassword(
  process: ProcessRenderer,
): Promise<string> {
  const generated = await process.runStep(
    "generating random password",
    async () => generatePassword(32),
  );

  process.addInfo(` generated password: ${generated} `);
  return generated;
}
