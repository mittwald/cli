import type { MittwaldAPIV2 } from "@mittwald/api-client";

type ContainerServiceDeclareRequest =
  MittwaldAPIV2.Components.Schemas.ContainerServiceDeclareRequest;

export type ContainerServiceInput = ContainerServiceDeclareRequest & {
  command?: string[] | string;
  entrypoint?: string[] | string;
  env_file?: string | string[];
  environment?: {
    [k: string]: string;
  };
  ports?: string[];
};
