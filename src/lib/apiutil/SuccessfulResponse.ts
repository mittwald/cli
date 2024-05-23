import { Response } from "@mittwald/api-client-commons";

/**
 * Helper type to assert that a response has a specific status code.
 *
 * Usage:
 *
 *     // ResponseType is a union of all possible responses
 *     type AppListResponseType = Awaited<
 *       ReturnType<MittwaldAPIV2Client["app"]["listAppinstallations"]>
 *     >;
 *
 *     type AppListSuccessfulResponse = SuccessfulResponse<
 *       AppListResponseType,
 *       200
 *     >;
 */
export type SuccessfulResponse<
  T extends Response,
  S extends T["status"],
> = T & {
  status: S;
};
