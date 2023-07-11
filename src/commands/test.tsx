import { ExecRenderBaseCommand } from "../rendering/react/ExecRenderBaseCommand.js";
import { FancyProcessRenderer } from "../rendering/react/process_fancy.js";
import { Text } from "ink";

export class Test extends ExecRenderBaseCommand<typeof Test, {}> {
  authenticationRequired = false;

  protected async exec(): Promise<{}> {
    const process = new FancyProcessRenderer("Fooing the bar");

    process.start();

    const step1 = process.addStep((<Text>Step 1</Text>));
    await wait(1000);

    step1.complete();

    process.complete(<Text>Bar successfully fooed</Text>);

    return Promise.resolve({});
  }

  protected render(executionResult: {}): React.ReactNode {
    return undefined;
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));