import { DeleteBaseCommand } from "../../../lib/basecommands/DeleteBaseCommand.js";
import {
  redisArgs,
  withRedisId,
} from "../../../lib/resources/database/redis/flags.js";
import assertSuccess from "../../../lib/apiutil/assert_success.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a Redis database";
  static resourceName = "Redis database";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = { ...redisArgs };

  protected async deleteResource(): Promise<void> {
    const redisDatabaseId = await withRedisId(
      this.apiClient,
      this.flags,
      this.args,
      this.config,
    );
    const response = await this.apiClient.database.deleteRedisDatabase({
      redisDatabaseId,
    });

    assertSuccess(response);
  }
}
