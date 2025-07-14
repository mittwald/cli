import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { GetBaseCommand } from "../../lib/basecommands/GetBaseCommand.js";
import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import React from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { usePromise } from "@mittwald/react-use-promise";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { domainArgs, withDomainId } from "../../lib/resources/domain/flags.js";
import { DomainDetails } from "../../rendering/react/components/Domain/DomainDetails.js";

type DomainDomain = MittwaldAPIV2.Components.Schemas.DomainDomain;

export class Get extends RenderBaseCommand<typeof Get> {
  static description = "gets a specific domain";

  static flags = {
    ...RenderBaseCommand.buildFlags(),
  };

  static args = {
    ...domainArgs,
  };

  protected render(): React.ReactNode {
    const domain = usePromise(() => this.getDomain(), []);

    if (this.flags.output === "json") {
      return <RenderJson name="domain" data={domain} />;
    }

    return <DomainDetails domain={domain} />;
  }

  protected async getDomain(): Promise<DomainDomain> {
    const domainId = await withDomainId(
      this.apiClient,
      Get,
      this.flags,
      this.args,
      this.config,
    );
    const response = await this.apiClient.domain.getDomain({
      domainId,
    });

    assertStatus(response, 200);

    return response.data;
  }
}
