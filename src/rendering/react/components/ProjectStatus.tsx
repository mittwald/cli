import { Text } from "ink";
import { FC } from "react";
import { ProjectEnabled } from "./ProjectEnabled.js";
import { ProjectReadiness } from "./ProjectReadiness.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";

interface Props {
  project:
    | MittwaldAPIV2.Components.Schemas.ProjectProject
    | MittwaldAPIV2.Paths.V2Projects.Get.Responses.$200.Content.ApplicationJson[number];
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
