declare module "docker-names" {
  function getRandomName(): string;
  function getRandomName(retry: boolean | number): string;
}
