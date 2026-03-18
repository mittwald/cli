export type RepositoryData = {
  buildContext: string;
  ports: string[];
  dockerfilePath?: string;
  dockerfileContent?: string;
  dockerfileCreated?: boolean;
  imageId?: string;
  imageName?: string;
  railpackPlanPath?: string;
};