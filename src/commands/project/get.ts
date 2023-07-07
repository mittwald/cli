/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { GeneratedProjectGetProject, PathParams } from "../../generated/project/getProject.js";
import { normalizeProjectIdToUuid } from "../../Helpers.js";

export default class Get extends GeneratedProjectGetProject {
  protected async mapParams(input: PathParams): Promise<PathParams> {
    input.id = await normalizeProjectIdToUuid(this.apiClient, input.id);
    return super.mapParams(input);
  }
}
