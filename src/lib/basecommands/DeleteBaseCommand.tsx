import { Flags, ux } from "@oclif/core";
import { BaseCommand } from "./BaseCommand.js";
import { ExecRenderBaseCommand } from "./ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  ProcessFlags,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Text } from "ink";
import React from "react";

export abstract class DeleteBaseCommand<
  T extends typeof BaseCommand,
> extends ExecRenderBaseCommand<T, void> {
  static resourceName = "object";
  static baseFlags = {
    ...ExecRenderBaseCommand.baseFlags,
    ...processFlags,
    force: Flags.boolean({
      char: "f",
      description: "do not ask for confirmation",
    }),
  };

  protected async exec(): Promise<void> {
    const resourceName = (this.ctor as typeof DeleteBaseCommand).resourceName;
    const process = makeProcessRenderer(
      this.flags as ProcessFlags,
      `Deleting ${resourceName}`,
    );

    if (!this.flags.force) {
      const confirmed = await process.addConfirmation(
        <Text>confirm deletion of {resourceName}</Text>,
      );
      if (!confirmed) {
        process.addInfo(<Text>deletion of {resourceName} was cancelled</Text>);
        process.complete(<></>);

        ux.exit(1);
        return;
      }
    }

    const deletingStep = process.addStep(<Text>deleting {resourceName}</Text>);

    try {
      await this.deleteResource();

      deletingStep.complete();
      process.complete(
        <Success>
          The {resourceName} was successfully deleted. How sad. 🥺
        </Success>,
      );
    } catch (err) {
      deletingStep.error(err);
      process.complete(<Text>Failed to delete {resourceName}</Text>);
      ux.exit(1);
    }
  }

  protected render() {
    return null;
  }

  protected abstract deleteResource(): Promise<void>;
}
