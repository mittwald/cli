import { FC } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { SingleResult } from "../SingleResult.js";
import { Value } from "../Value.js";
import { Box, Text } from "ink";
import { IDAndShortID } from "../IDAndShortID.js";
import { CreatedAt } from "../CreatedAt.js";
import { useProject } from "../../../../lib/project/hooks.js";
import { useAppInstallation } from "../../../../lib/app/hooks.js";
import { FormattedDate } from "../FormattedDate.js";
type CronjobCronjob = MittwaldAPIV2.Components.Schemas.CronjobCronjob;
type CronjobCronjobUrl = MittwaldAPIV2.Components.Schemas.CronjobCronjobUrl;
type CronjobCronjobCommand =
  MittwaldAPIV2.Components.Schemas.CronjobCronjobCommand;

type CronJobComponent = FC<{ cronjob: CronjobCronjob }>;

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
  const app = useAppInstallation(cronjob.appId);

  const rows = {
    "Cron Job ID": <IDAndShortID object={cronjob} />,
    "Created At": <CreatedAt object={cronjob} />,
    Project: project ? <IDAndShortID object={project} /> : <Value notSet />,
    App: <IDAndShortID object={app} />,
    Schedule: (
      <Text>
        <Value>{cronjob.interval}</Value> (next execution:{" "}
        <CronJobNextExecution cronjob={cronjob} />)
      </Text>
    ),
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

  if ("url" in cronjob.destination) {
    sections.push(
      <CronJobExecutionTargetURL
        key="destination"
        dest={cronjob.destination}
      />,
    );
  } else {
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
