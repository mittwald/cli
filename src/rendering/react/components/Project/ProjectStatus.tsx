import { Text } from "ink";
import { FC } from "react";
import { ProjectEnabled } from "./ProjectEnabled.js";
import { ProjectReadiness } from "./ProjectReadiness.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import ProjectProjectReadinessStatus = MittwaldAPIV2.Components.Schemas.ProjectProjectReadinessStatus;

interface Props {
  /**
   * The project to display the status for.
   *
   * Use a custom type instead of any of the generated types, because there are
   * multiple, slightly different types for project responses. However, all
   * response types should implement this interface one way or another.
   */
  project: {
    enabled: boolean;
    readiness: ProjectProjectReadinessStatus;
  };
}

export const ProjectStatus: FC<Props> = (props) => {
  const { project } = props;

  return (
    <Text>
      <ProjectEnabled enabled={project.enabled} />
      <Text> / </Text>
      <ProjectReadiness readiness={project.readiness} />
    </Text>
  );
};
