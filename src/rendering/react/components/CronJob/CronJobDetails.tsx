import { FC, ReactNode } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { SingleResult } from "../SingleResult.js";
import { Value } from "../Value.js";
import { Box, Text } from "ink";
import { IDAndShortID } from "../IDAndShortID.js";
import { CreatedAt } from "../CreatedAt.js";
import { useProject } from "../../../../lib/resources/project/hooks.js";
import { useAppInstallation } from "../../../../lib/resources/app/hooks.js";
import { FormattedDate } from "../FormattedDate.js";
type CronjobCronjob = MittwaldAPIV2.Components.Schemas.CronjobCronjob;
type CronjobCronjobUrl = MittwaldAPIV2.Components.Schemas.CronjobCronjobUrl;
type CronjobCronjobCommand =
  MittwaldAPIV2.Components.Schemas.CronjobCronjobCommand;
type CronjobServiceTargetResponse =
  MittwaldAPIV2.Components.Schemas.CronjobServiceTargetResponse;

type CronJobComponent = FC<{ cronjob: CronjobCronjob }>;

// A cron job either targets an app installation or a container (a service
// running in a stack). Container cron jobs carry a service target instead of
// an app id, so we must not try to resolve them as app installations.
const getServiceTarget = (
  cronjob: CronjobCronjob,
): CronjobServiceTargetResponse | undefined => {
  const { target } = cronjob;
  return target && "stackId" in target ? target : undefined;
};

const CronJobNextExecution: CronJobComponent = ({ cronjob }) => {
  if (!cronjob.nextExecutionTime) {
    return <Value notSet />;
  }

  return (
    <Value>
      <FormattedDate relative date={cronjob.nextExecutionTime} />
    </Value>
  );
};

const CronJobAppTarget: FC<{ appInstallationId: string }> = ({
  appInstallationId,
}) => {
  const app = useAppInstallation(appInstallationId);
  return <IDAndShortID object={app} />;
};

const CronJobExecutionTargetContainer: FC<{
  target: CronjobServiceTargetResponse;
}> = ({ target }) => {
  return (
    <SingleResult
      title="EXECUTION TARGET"
      rows={{
        Command: <Value>{target.command}</Value>,
      }}
    />
  );
};

const CronJobExecutionTargetURL: FC<{ dest: CronjobCronjobUrl }> = ({
  dest,
}) => {
  return (
    <SingleResult
      title="EXECUTION TARGET"
      rows={{
        URL: <Value>{dest.url}</Value>,
      }}
    />
  );
};

const CronJobExecutionTargetCommand: FC<{ command: CronjobCronjobCommand }> = ({
  command,
}) => {
  return (
    <SingleResult
      title="EXECUTION TARGET"
      rows={{
        Interpreter: <Value>{command.interpreter}</Value>,
        Script: <Value>{command.path}</Value>,
        Parameters: command.parameters ? (
          <Value>{command.parameters} </Value>
        ) : (
          <Value notSet />
        ),
      }}
    />
  );
};

export const CronJobDetails: CronJobComponent = ({ cronjob }) => {
  const project = cronjob.projectId ? useProject(cronjob.projectId) : null;
  const serviceTarget = getServiceTarget(cronjob);

  const rows: Record<string, ReactNode> = {
    "Cron Job ID": <IDAndShortID object={cronjob} />,
    "Created At": <CreatedAt object={cronjob} />,
    Project: project ? <IDAndShortID object={project} /> : <Value notSet />,
    ...(serviceTarget
      ? {
          Stack: <Value>{serviceTarget.stackId}</Value>,
          Container: <Value>{serviceTarget.serviceShortId}</Value>,
        }
      : {
          App: (
            <CronJobAppTarget
              appInstallationId={cronjob.appInstallationId ?? cronjob.appId}
            />
          ),
        }),
    Schedule: (
      <Text>
        <Value>{cronjob.interval}</Value> (next execution:{" "}
        <CronJobNextExecution cronjob={cronjob} />)
      </Text>
    ),
    Timezone: <Value>{cronjob.timeZone || "UTC"}</Value>,
  };

  const sections = [
    <SingleResult
      key="primary"
      title={
        <>
          CRON JOB DETAILS: <Value>{cronjob.description}</Value>
        </>
      }
      rows={rows}
    />,
  ];

  if (serviceTarget) {
    sections.push(
      <CronJobExecutionTargetContainer
        key="destination"
        target={serviceTarget}
      />,
    );
  } else if (cronjob.destination && "url" in cronjob.destination) {
    sections.push(
      <CronJobExecutionTargetURL
        key="destination"
        dest={cronjob.destination}
      />,
    );
  } else if (cronjob.destination) {
    sections.push(
      <CronJobExecutionTargetCommand
        key="destination"
        command={cronjob.destination}
      />,
    );
  }

  return (
    <Box flexDirection="column" marginBottom={1}>
      {sections}
    </Box>
  );
};
