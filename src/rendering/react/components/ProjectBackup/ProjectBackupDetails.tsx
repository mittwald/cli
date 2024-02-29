import React, { FC } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
type BackupProjectBackup = MittwaldAPIV2.Components.Schemas.BackupProjectBackup;
import { SingleResult, SingleResultTable } from "../SingleResult.js";
import { Text } from "ink";
import { Value } from "../Value.js";
import { useProjectBackupSchedule } from "../../../../lib/projectbackup/hooks.js";
import { FormattedDate } from "../FormattedDate.js";
import { ProjectBackupStatus } from "./ProjectBackupStatus.js";
import { useProject } from "../../../../lib/project/hooks.js";
import { IDAndShortID } from "../IDAndShortID.js";

export const ProjectBackupDetails: FC<{
  projectBackup: BackupProjectBackup;
}> = ({ projectBackup }) => {
  const project = useProject(projectBackup.projectId);
  const schedule = projectBackup.parentId
    ? useProjectBackupSchedule(projectBackup.parentId)
    : undefined;

  return (
    <SingleResult
      title={
        <Text>
          PROJECT BACKUP: <Value>{projectBackup.id}</Value>
        </Text>
      }
      rows={{
        ID: <Value>{projectBackup.id}</Value>,
        "Created at": projectBackup.createdAt ? (
          <Value>
            <FormattedDate date={projectBackup.createdAt} relative absolute />
          </Value>
        ) : (
          <Value notSet />
        ),
        "Expires in": projectBackup.expiresAt ? (
          <Value>
            <FormattedDate date={projectBackup.expiresAt} relative absolute />
          </Value>
        ) : (
          <Value notSet />
        ),
        Status: <ProjectBackupStatus projectBackup={projectBackup} />,
        Project: (
          <SingleResultTable
            rows={{
              ID: <IDAndShortID object={project} />,
              Description: <Value>{project.description}</Value>,
            }}
          />
        ),
        Schedule: schedule ? (
          <SingleResultTable
            rows={{
              ID: <Value>{schedule.id}</Value>,
              Schedule: <Value>{schedule.schedule}</Value>,
            }}
          />
        ) : (
          <Value notSet />
        ),
      }}
    />
  );
};
