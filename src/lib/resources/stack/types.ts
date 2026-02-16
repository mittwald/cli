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

// We've kept this as simple and flexible as possible to reduce bloat
export type RawStackInput = {
  services?: {
    [serviceName: string]: {
      // Allow raw input and map notation for environment vars
      environment?: string[] | { [k: string]: string };
      env_file?: string | string[];
      image: string;
      ports?: string[];
      command?: string[];
      description?: string;
      envs?: string[] | { [k: string]: string };
    };
  };
  volumes?: {
    [key: string]: {
      name: string;
    };
  };
};
