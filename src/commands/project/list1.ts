import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { TableRenderSetup } from "../../rendering/setup/TableRenderSetup.js";
import { Table } from "../../rendering/oclif/components/table.js";

const tableSetup = new TableRenderSetup({
  columns: ["id", "name"],
});

export default class List extends ExtendedBaseCommand<typeof List> {
  public static flags = {
    ...tableSetup.flags,
  };

  public async run(): Promise<void> {
    const projects = await this.apiClient.project.listProjects({});
    assertStatus(projects, 200);

    const setup = tableSetup.getSetup(this.flags);

    Table.build(projects.data, setup).render();
  }
}
