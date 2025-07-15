import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../lib/basecommands/GetBaseCommand.js";
import { projectArgs } from "../../../lib/resources/project/flags.js";
import { RenderBaseCommand } from "../../../lib/basecommands/RenderBaseCommand.js";
import { ReactNode } from "react";
import { usePromise } from "@mittwald/react-use-promise";
import { SingleResult } from "../../../rendering/react/components/SingleResult.js";
import { Box, Text } from "ink";
import { Value } from "../../../rendering/react/components/Value.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { Flags } from "@oclif/core";
import { Note, noteColor } from "../../../rendering/react/components/Note.js";
import { ListItem } from "../../../rendering/react/components/ListItem.js";
import ByteQuantity from "../../../lib/units/ByteQuantity.js";
import maybe from "../../../lib/util/maybe.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdFilesystemDiskUsage.Get.Parameters.Path;

export class Usage extends RenderBaseCommand<typeof Usage> {
  static description = "Get a project directory filesystem usage.";

  static flags = {
    ...RenderBaseCommand.buildFlags(),
    human: Flags.boolean({
      description: "Display human readable sizes.",
    }),
  };
  static args = { ...projectArgs };

  protected render(): ReactNode {
    const projectId = this.useProjectId(Usage);
    const project = usePromise(
      (projectId: string) => this.apiClient.project.getProject({ projectId }),
      [projectId],
    );
    const projectDiskUsage = usePromise(
      (id: string) =>
        this.apiClient.projectFileSystem.getDiskUsage({
          projectId: id,
        }),
      [projectId],
    );

    assertStatus(project, 200);
    assertStatus(projectDiskUsage, 200);

    const planLimitStr = project.data.spec?.storage ?? undefined;
    const planLimit = planLimitStr
      ? ByteQuantity.fromString(planLimitStr)
      : undefined;

    const formatSize = this.flags.human
      ? (bytes: ByteQuantity) => <Value>{bytes.format()}</Value>
      : (bytes: ByteQuantity) => <Value>{bytes.bytes}</Value>;
    const formatMaybe = (bytes: ByteQuantity | undefined) => (
      <Text>{bytes ? formatSize(bytes) : <Value notSet />}</Text>
    );
    const usageRelative =
      planLimit && projectDiskUsage.data.usedBytes
        ? projectDiskUsage.data.usedBytes / planLimit.bytes
        : undefined;

    const UsageRelative = () => {
      if (!usageRelative) {
        return undefined;
      }

      return (
        <Text>
          {" "}
          {"("}relative: <Value>{Math.round(usageRelative * 100)}%</Value>)
        </Text>
      );
    };

    const maybeQuantity = maybe(ByteQuantity.fromBytes);

    const total = maybeQuantity(projectDiskUsage.data.totalBytes);
    const used = maybeQuantity(projectDiskUsage.data.usedBytes);

    return (
      <Box flexDirection="column">
        <SingleResult
          title={
            <Text>
              PROJECT FILESYSTEM USAGE:{" "}
              <Value>{project.data.description}</Value>
            </Text>
          }
          rows={{
            "Provisioned storage": formatMaybe(planLimit),
            "Hard limit": formatMaybe(total),
            Usage: (
              <Text>
                {formatMaybe(used)}
                <UsageRelative />
              </Text>
            ),
          }}
        />
        <Note marginY={1} raw={true}>
          <Text color={noteColor}>
            When inspecting the filesystem usage, please note the following:
          </Text>
          <Box marginTop={1} flexDirection="column">
            <ListItem>
              <Text color={noteColor}>
                The usage is not updated in real-time. It may take a up to an
                hour for the usage to be updated.
              </Text>
            </ListItem>
            <ListItem>
              <Text color={noteColor}>
                The "hard limit" is a technical limitation that is not related
                to your hosting plan.
              </Text>
            </ListItem>
          </Box>
        </Note>
      </Box>
    );
  }
}
