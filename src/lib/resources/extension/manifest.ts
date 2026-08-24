import { MittwaldAPIV2 } from "@mittwald/api-client";

export type ExtensionManifest = Pick<
  MittwaldAPIV2.Components.Schemas.MarketplaceOwnExtension,
  | "id"
  | "contributorId"
  | "name"
  | "context"
  | "description"
  | "detailedDescriptions"
  | "externalFrontends"
  | "frontendFragments"
  | "scopes"
  | "subTitle"
  | "support"
  | "tags"
  | "webhookUrls"
> & {
  deprecation?: {
    deprecatedAt: string;
    note?: string;
    successorId?: string;
  };
};
