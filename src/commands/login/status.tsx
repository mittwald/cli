import { formatDistanceToNow } from "date-fns";
import { RenderBaseCommand } from "src/lib/basecommands/RenderBaseCommand.js";
import { SingleResult, SingleResultTable } from "src/rendering/react/components/SingleResult.js";
import useOwnAccount from "src/lib/resources/login/useOwnAccount.js";
import { ReactNode } from "react";

export default class Status extends RenderBaseCommand<typeof Status> {
  static description = "Checks your current authentication status";

  protected render() {
    const account = useOwnAccount(this.apiClient);
    const rows: Record<string, ReactNode> = {};

    rows["User identification"] = <SingleResultTable rows={{
      Id: account.userId,
      Email: account.email,
    }} />;

    if (account.person) {
      rows["Name"] = `${account.person.firstName} ${account.person.lastName}`;
    }

    if (account.passwordUpdatedAt) {
      rows["Last password change"] = `${formatDistanceToNow(
        new Date(account.passwordUpdatedAt),
      )} ago`;
    }

    return <SingleResult title="Login status" rows={rows} />
  }
}
