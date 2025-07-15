import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { GetBaseCommand } from "../../lib/basecommands/GetBaseCommand.js";
import { Args } from "@oclif/core";
import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import { ComponentPrinter } from "../../rendering/react/ComponentPrinter.js";
import { ReactNode } from "react";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { CronJobDetails } from "../../rendering/react/components/CronJob/CronJobDetails.js";
import { GetFormatter } from "../../rendering/formatter/GetFormatter.js";

type CronjobCronjob = MittwaldAPIV2.Components.Schemas.CronjobCronjob;

export class Get extends RenderBaseCommand<typeof Get> {
  static description = "Get details of a cron job";

  static flags = { ...RenderBaseCommand.buildFlags() };
  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cron job to be retrieved.",
      required: true,
    }),
  };

  protected formatter: GetFormatter = new GetFormatter<CronjobCronjob>(
    new ComponentPrinter((r) => <CronJobDetails cronjob={r} />),
  );

  protected render(): ReactNode {
    const { "cronjob-id": cronjobId } = this.args;
    const cronjobResponse = usePromise(
      (cronjobId: string) => this.apiClient.cronjob.getCronjob({ cronjobId }),
      [cronjobId],
    );

    assertStatus(cronjobResponse, 200);

    if (this.flags.output === "json") {
      return <RenderJson name="cronjob" data={cronjobResponse.data} />;
    }

    return <CronJobDetails cronjob={cronjobResponse.data} />;
  }
}
