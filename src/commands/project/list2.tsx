import React from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { usePromise } from "@mittwald/react-use-promise";
import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { useRenderContext } from "../../rendering/react/context.js";
import { Table } from "../../rendering/react/components/Table.js";
import { UsePromiseRenderSetup } from "../../rendering/setup/usePromiseSetup.js";
import { TableRenderSetup } from "../../rendering/setup/TableRenderSetup.js";

const usePromiseSetup = new UsePromiseRenderSetup();

const tableSetup = new TableRenderSetup({
  columns: ["id", "name"],
});

export default class List extends RenderBaseCommand<typeof List> {
  public static flags = {
    ...usePromiseSetup.flags,
    ...tableSetup.flags,
    ...RenderBaseCommand.buildFlags(),
  };

  protected render(): React.ReactNode {
    const { apiClient } = useRenderContext();

    const tableProps = tableSetup.getSetup(this.flags);
    const usePromiseOptions = usePromiseSetup.getSetup(this.flags);

    const projects = usePromise(
      apiClient.project.listProjects,
      [],
      usePromiseOptions,
    );

    assertStatus(projects, 200);

    return <Table data={projects.data} {...tableProps} />;
  }
}
