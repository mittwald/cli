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

// Rows describing where and how the cron job is executed. For container cron
// jobs this is the stack/container running the command; for app cron jobs it
// is the app installation together with the invoked URL or command.
const buildExecutionTargetRows = (
  cronjob: CronjobCronjob,
  serviceTarget: CronjobServiceTargetResponse | undefined,
): Record<string, ReactNode> => {
  if (serviceTarget) {
    return {
      Stack: <Value>{serviceTarget.stackId}</Value>,
      Container: <Value>{serviceTarget.serviceShortId}</Value>,
      Command: <Value>{serviceTarget.command}</Value>,
    };
  }

  const app = (
    <CronJobAppTarget
      appInstallationId={cronjob.appInstallationId ?? cronjob.appId}
    />
  );

  const { destination } = cronjob;
  if (destination && "url" in destination) {
    return {
      App: app,
      URL: <Value>{destination.url}</Value>,
    };
  }
  if (destination) {
    return {
      App: app,
      Interpreter: <Value>{destination.interpreter}</Value>,
      Script: <Value>{destination.path}</Value>,
      Parameters: destination.parameters ? (
        <Value>{destination.parameters} </Value>
      ) : (
        <Value notSet />
      ),
    };
  }

  return { App: app };
};

export const CronJobDetails: CronJobComponent = ({ cronjob }) => {
  const project = cronjob.projectId ? useProject(cronjob.projectId) : null;
  const serviceTarget = getServiceTarget(cronjob);

  const rows: Record<string, ReactNode> = {
    "Cron Job ID": <IDAndShortID object={cronjob} />,
    "Created At": <CreatedAt object={cronjob} />,
    Project: project ? <IDAndShortID object={project} /> : <Value notSet />,
    Schedule: (
      <Text>
        <Value>{cronjob.interval}</Value> (next execution:{" "}
        <CronJobNextExecution cronjob={cronjob} />)
      </Text>
    ),
    Timezone: <Value>{cronjob.timeZone || "UTC"}</Value>,
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      <SingleResult
        title={
          <>
            CRON JOB DETAILS: <Value>{cronjob.description}</Value>
          </>
        }
        rows={rows}
      />
      <SingleResult
        title="EXECUTION TARGET"
        rows={buildExecutionTargetRows(cronjob, serviceTarget)}
      />
    </Box>
  );
};
