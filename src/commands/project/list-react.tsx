import React from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { usePromise } from "@mittwald/react-use-promise";
import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { useRenderContext } from "../../rendering/react/context.js";
import { Table } from "../../rendering/react/components/Table/index.js";
import { UsePromiseRenderSetup } from "../../rendering/setup/usePromiseSetup.js";
import { TableRenderSetup } from "../../rendering/setup/TableRenderSetup.js";

const usePromiseSetup = new UsePromiseRenderSetup();

const tableSetupInstance = new TableRenderSetup();

export default class List extends RenderBaseCommand<typeof List> {
  public static flags = {
    ...usePromiseSetup.flags,
    ...tableSetupInstance.flags,
    ...RenderBaseCommand.buildFlags(),
  };

  protected render(): React.ReactNode {
    const { apiClient } = useRenderContext();

    const tableSetup = tableSetupInstance.getSetup(this.flags);
    const usePromiseOptions = usePromiseSetup.getSetup(this.flags);

    const projects = usePromise(
      apiClient.project.listProjects,
      [],
      usePromiseOptions,
    );

    assertStatus(projects, 200);

    return (
      <Table
        data={projects.data}
        setup={tableSetup}
        columns={{
          id: {
            isUuid: true,
          },
          shortId: {
            minWidth: 8,
          },
          customerId: {
            isUuid: true,
            extended: true,
          },
          description: {},
          status: {
            render: (project) =>
              !project.enabled ? "disabled" : project.readiness,
          },
          createdAt: {},
        }}
      />
    );
  }
}
