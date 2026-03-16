export type RepositoryData = {
  dockerfilePath: string;
  dockerfileContent: string;
  dockerfileCreated: boolean;
  buildContext: string;
  ports: string[];
  imageId?: string;
  imageName?: string;
};