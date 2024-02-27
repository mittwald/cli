import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";
import { Args } from "@oclif/core";
import { RenderBaseCommand } from "../../../rendering/react/RenderBaseCommand.js";
import { FC, ReactNode } from "react";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { RenderJson } from "../../../rendering/react/json/RenderJson.js";
import { useRenderContext } from "../../../rendering/react/context.js";
import { SingleResult } from "../../../rendering/react/components/SingleResult.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { Box, Text } from "ink";
import { Header } from "../../../rendering/react/components/Header.js";
import { DnsValidationErrors } from "../../../rendering/react/components/Ingress/DnsValidationErrors.js";

type IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;
type IngressPath = MittwaldAPIV2.Components.Schemas.IngressPath;

export type PathParams =
  MittwaldAPIV2.Paths.V2IngressesIngressId.Get.Parameters.Path;

const IngressPath: FC<{ path: IngressPath }> = ({ path }) => {
  if ("directory" in path.target) {
    return (
      <Text>
        {"->"} Local directory: <Value>{path.target.directory}</Value>
      </Text>
    );
  }

  if ("url" in path.target) {
    return (
      <Text>
        {"->"} Redirect: <Value>{path.target.url}</Value>
      </Text>
    );
  }

  if ("installationId" in path.target) {
    const { apiClient } = useRenderContext();
    const installation = usePromise(
      (id) =>
        apiClient.app.getAppinstallation({
          appInstallationId: id,
        }),
      [path.target.installationId],
    );
    assertStatus(installation, 200);

    const app = usePromise(
      (id) => apiClient.app.getApp({ appId: id }),
      [installation.data.appId],
    );
    assertStatus(app, 200);

    return (
      <Text>
        {"->"} App: <Value>{app.data.name}</Value>, installed at{" "}
        <Value>{installation.data.installationPath}</Value>
      </Text>
    );
  }
};

const IngressPaths: FC<{ ingress: IngressIngress }> = ({ ingress }) => {
  const paths: Record<string, ReactNode> = {};

  for (const path of ingress.paths) {
    paths[path.path] = <IngressPath path={path} />;
  }

  return <SingleResult title="Paths" rows={paths} />;
};

const GetIngress: FC<{ ingress: IngressIngress }> = ({ ingress }) => {
  const rows = {
    "Virtual Host ID": <Value>{ingress.id}</Value>,
    Hostname: <Value>{ingress.hostname}</Value>,
    "IP addresses": <Value>{ingress.ips.v4.join("\n")}</Value>,
  };
  const sections = [
    <SingleResult
      key="primary"
      title={
        <>
          VIRTUAL HOST DETAILS: <Value>{ingress.hostname}</Value>
        </>
      }
      rows={rows}
    />,
    <IngressPaths key="paths" ingress={ingress} />,
  ];

  if (ingress.dnsValidationErrors.length > 0) {
    sections.push(
      <Box key="dns-validation-errors" flexDirection="column">
        <Box marginY={1}>
          <Header title="DNS validation errors" />
        </Box>
        <DnsValidationErrors ingress={ingress} />
      </Box>,
    );
  }

  return (
    <Box flexDirection="column" marginBottom={1}>
      {sections}
    </Box>
  );
};

export class Get extends RenderBaseCommand<typeof Get> {
  static description = "Get a virtual host.";

  static flags = { ...GetBaseCommand.baseFlags };
  static args = {
    "ingress-id": Args.string({
      summary: "The ID of the ingress to get.",
      required: true,
    }),
  };

  protected render(): ReactNode {
    const ingressId = this.args["ingress-id"];
    const ingressResponse = usePromise(
      (id: string) =>
        this.apiClient.domain.ingressGetIngress({
          ingressId: id,
        }),
      [ingressId],
    );

    assertStatus(ingressResponse, 200);

    if (this.flags.output === "json") {
      return <RenderJson name="ingress" data={ingressResponse.data} />;
    }

    return <GetIngress ingress={ingressResponse.data} />;
  }
}
