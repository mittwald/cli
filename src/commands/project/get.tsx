import { GetBaseCommand } from "../../lib/basecommands/GetBaseCommand.js";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { projectArgs } from "../../lib/resources/project/flags.js";
import { FC, ReactNode } from "react";
import {
  SingleResult,
  SingleResultTable,
} from "../../rendering/react/components/SingleResult.js";
import { Box, Text } from "ink";
import { Value } from "../../rendering/react/components/Value.js";
import { IDAndShortID } from "../../rendering/react/components/IDAndShortID.js";
import { CreatedAt } from "../../rendering/react/components/CreatedAt.js";
import { useRenderContext } from "../../rendering/react/context.js";
import { usePromise } from "@mittwald/react-use-promise";
import { ComponentPrinter } from "../../rendering/react/ComponentPrinter.js";
import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { ByteFormat } from "../../rendering/react/components/ByteFormat.js";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import Link from "ink-link";
import { ProjectStatus } from "../../rendering/react/components/Project/ProjectStatus.js";
import ByteQuantity from "../../lib/units/ByteQuantity.js";
import { GetFormatter } from "../../rendering/GetFormatter.js";

type ProjectHardwareSpec = MittwaldAPIV2.Components.Schemas.ProjectHardwareSpec;
type ProjectVisitorSpec = MittwaldAPIV2.Components.Schemas.ProjectVisitorSpec;
type ProjectProject = MittwaldAPIV2.Components.Schemas.ProjectProject;
type CustomerCustomer = MittwaldAPIV2.Components.Schemas.CustomerCustomer;

const ProjectSpecs: FC<{
  projectId: string;
  spec: ProjectHardwareSpec | ProjectVisitorSpec;
}> = ({ projectId, spec }) => {
  if ("cpu" in spec) {
    const { apiClient } = useRenderContext();
    const usage = usePromise(
      (id: string) =>
        apiClient.projectFileSystem.getDiskUsage({
          projectId: id,
        }),
      [projectId],
    );

    const used = usage.data?.usedBytes ? (
      <Text>
        {" "}
        (
        <Value>
          {ByteQuantity.fromBytes(usage.data?.usedBytes as number).format()}
        </Value>{" "}
        used)
      </Text>
    ) : undefined;

    return (
      <SingleResult
        title="Compute resources"
        rows={{
          CPUs: <Value>{spec.cpu}</Value>,
          Memory: <Value>{(spec as any).memory}</Value>, // eslint-disable-line
          Storage: (
            <Text>
              <Value>{spec.storage}</Value>
              {used}
            </Text>
          ),
        }}
      />
    );
  }
};

const ProjectCustomer: FC<{ customer: CustomerCustomer }> = ({ customer }) => {
  return (
    <SingleResultTable
      rows={{
        ID: <Value>{customer.customerId}</Value>,
        Customernumber: <Value>{customer.customerNumber}</Value>,
        Name: <Value>{customer.name}</Value>,
      }}
    />
  );
};

const GetProject: FC<{ response: ProjectProject }> = ({ response }) => {
  const { apiClient } = useRenderContext();
  const customer = usePromise(
    (id) => apiClient.customer.getCustomer({ customerId: id }),
    [response.customerId],
  );

  const vhosts = usePromise(
    (id) =>
      apiClient.domain.ingressListIngresses({
        queryParameters: { projectId: id },
      }),
    [response.id],
  );

  assertStatus(customer, 200);
  assertStatus(vhosts, 200);

  const host = vhosts.data.find((h) => h.isDefault)?.hostname;
  const url = host ? `https://${host}` : undefined;
  const rows = {
    "Project ID": <IDAndShortID object={response} />,
    "Created At": <CreatedAt object={response} />,
    Status: <ProjectStatus project={response} />,
    Customer: <ProjectCustomer customer={customer.data} />,
  };

  const sections = [
    <SingleResult
      key="primary"
      title={
        <>
          PROJECT DETAILS: <Value>{response.description}</Value>
        </>
      }
      rows={rows}
    />,
    <SingleResult
      key="access"
      title="Access"
      rows={{
        "HTTP(S)":
          host && url ? (
            <Link url={url}>
              <Value>{host}</Value>
            </Link>
          ) : (
            <Value notSet />
          ),
        "SSH/SFTP": (
          <Text>
            <Value>
              ssh.{response.clusterID}.{response.clusterDomain}
            </Value>{" "}
            <Text color="gray">
              (Use the "project ssh" command to connect directly using the CLI)
            </Text>
          </Text>
        ),
      }}
    />,
  ];

  if (response.spec) {
    sections.push(
      <ProjectSpecs key="specs" projectId={response.id} spec={response.spec} />,
    );
  }

  return (
    <Box flexDirection="column" marginBottom={1}>
      {sections}
    </Box>
  );
};

export class Get extends RenderBaseCommand<typeof Get> {
  static description = "Get details of a project";

  static flags = { ...GetBaseCommand.baseFlags };
  static args = { ...projectArgs };

  protected formatter: GetFormatter = new GetFormatter<ProjectProject>(
    new ComponentPrinter((r) => <GetProject response={r} />),
  );

  protected render(): ReactNode {
    const projectId = this.useProjectId(Get);
    const projectResponse = usePromise(
      (projectId: string) => this.apiClient.project.getProject({ projectId }),
      [projectId],
    );

    assertStatus(projectResponse, 200);

    if (this.flags.output === "json") {
      return <RenderJson name="project" data={projectResponse.data} />;
    }

    return <GetProject response={projectResponse.data} />;
  }
}
