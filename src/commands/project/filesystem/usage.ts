/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { GeneratedProjectFileSystemGetDiskUsage, PathParams } from "../../../generated/projectFileSystem/getDiskUsage.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";

export default class Get extends GeneratedProjectFileSystemGetDiskUsage {
  protected async mapParams(input: PathParams): Promise<PathParams> {
    input.projectId = await normalizeProjectIdToUuid(
      this.apiClient,
      input.projectId,
    );
    return super.mapParams(input);
  }
}
