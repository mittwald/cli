import { GetBaseCommand } from "../../GetBaseCommand.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { projectArgs, withProjectId } from "../../lib/project/flags.js";
import { FC, ReactNode } from "react";
import { GetFormatter } from "../../Formatter.js";
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
import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { ByteFormat } from "../../rendering/react/components/ByteFormat.js";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import Link from "ink-link";
import ProjectHardwareSpec = MittwaldAPIV2.Components.Schemas.ProjectHardwareSpec;
import ProjectVisitorSpec = MittwaldAPIV2.Components.Schemas.ProjectVisitorSpec;
import ProjectProject = MittwaldAPIV2.Components.Schemas.ProjectProject;
import CustomerCustomer = MittwaldAPIV2.Components.Schemas.CustomerCustomer;

const ProjectReadiness: FC<{
  readiness: MittwaldAPIV2.Components.Schemas.ProjectProjectReadinessStatus;
}> = ({ readiness }) => {
  switch (readiness) {
    case "ready":
      return <Text color="green">ready 🚀</Text>;
    case "creating":
      return <Text color="blue">creating 🏗</Text>;
    case "unready":
      return <Text color="red">unready 💀</Text>;
    default:
      return <Value notSet />;
  }
};

const ProjectEnabled: FC<{ object: { enabled: boolean } }> = ({ object }) => {
  if (object.enabled) {
    return <Text color="green">enabled</Text>;
  }
  return <Text color="red">disabled</Text>;
};

const ProjectStatus: FC<{ object: ProjectProject }> = ({ object }) => {
  return (
    <Box>
      <ProjectEnabled object={object} />
      <Text> / </Text>
      <ProjectReadiness readiness={object.readiness} />
    </Box>
  );
};

const ProjectSpecs: FC<{
  projectId: string;
  spec: ProjectHardwareSpec | ProjectVisitorSpec;
}> = ({ projectId, spec }) => {
  if ("cpu" in spec) {
    const { apiClient } = useRenderContext();
    const usage = usePromise(
      (id: string) =>
        apiClient.projectFileSystem.getDiskUsage({
          pathParameters: { projectId: id },
        }),
      [projectId],
    );

    const used = usage.data?.usedBytes ? (
      <Text>
        {" "}
        (
        <Value>
          <ByteFormat bytes={usage.data?.usedBytes as number} />
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
    (id) =>
      apiClient.customer.getCustomer({ pathParameters: { customerId: id } }),
    [response.customerId],
  );

  assertStatus(customer, 200);

  const host = `${response.shortId}.project.space`;
  const url = `https://${host}`;
  const rows = {
    "Project ID": <IDAndShortID object={response} />,
    "Created At": <CreatedAt object={response} />,
    Status: <ProjectStatus object={response} />,
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
        "HTTP(S)": (
          <Link url={url}>
            <Value>{host}</Value>
          </Link>
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
  static description = "Get a Project.";

  static flags = { ...GetBaseCommand.baseFlags };
  static args = { ...projectArgs };

  protected formatter: GetFormatter = new GetFormatter<ProjectProject>(
    new ComponentPrinter((r) => <GetProject response={r} />),
  );

  protected render(): ReactNode {
    const projectId = usePromise(
      () => withProjectId(this.apiClient, this.flags, this.args, this.config),
      [],
    );
    const projectResponse = usePromise(
      (id: string) =>
        this.apiClient.project.getProject({ pathParameters: { id } }),
      [projectId],
    );

    assertStatus(projectResponse, 200);

    if (this.flags.output === "json") {
      return <RenderJson name="project" data={projectResponse.data} />;
    }

    return <GetProject response={projectResponse.data} />;
  }
}
