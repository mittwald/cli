import { formatDistanceToNow } from "date-fns";
import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import {
  SingleResult,
  SingleResultTable,
} from "../../rendering/react/components/SingleResult.js";
import useOwnAccount from "../../lib/resources/login/useOwnAccount.js";
import { ReactNode } from "react";
import { Text } from "ink";

export default class Status extends RenderBaseCommand<typeof Status> {
  static description = "Checks your current authentication status";

  protected render() {
    const account = useOwnAccount(this.apiClient);
    const rows: Record<string, ReactNode> = {};

    rows["User identification"] = (
      <SingleResultTable
        rows={{
          Id: <Text>{account.userId}</Text>,
          Email: <Text>{account.email}</Text>,
        }}
      />
    );

    if (account.person) {
      rows["Name"] = (
        <Text>
          {account.person.firstName} {account.person.lastName}
        </Text>
      );
    }

    if (account.passwordUpdatedAt) {
      rows["Last password change"] = (
        <Text>
          {formatDistanceToNow(new Date(account.passwordUpdatedAt))} ago
        </Text>
      );
    }

    return <SingleResult title="Login status" rows={rows} />;
  }
}
