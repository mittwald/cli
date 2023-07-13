/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import {
  GeneratedProjectGetSelfMembershipForProject,
  PathParams
} from "../../../generated/project/getSelfMembershipForProject.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";

export default class Get extends GeneratedProjectGetSelfMembershipForProject {
  protected async mapParams(input: PathParams): Promise<PathParams> {
    input.projectId = await normalizeProjectIdToUuid(
      this.apiClient,
      input.projectId,
    );
    return super.mapParams(input);
  }
}
