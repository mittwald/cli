import { Flags } from "@oclif/core";
import { AlphabetLowercase } from "@oclif/core/interfaces";

type ContainerStringFlagOptions = {
  summary: string;
  description: string;
};

type ContainerPublishFlagOptions = ContainerStringFlagOptions & {
  char?: AlphabetLowercase;
};

type ContainerVolumeFlagOptions = ContainerStringFlagOptions;

export function makeContainerEnvFlag() {
  return Flags.custom<string[]>({
    summary: "set environment variables in the container",
    description:
      "Format: KEY=VALUE or KEY. If only KEY is provided, the value is resolved from the caller environment (exported variables only). Multiple environment variables can be specified with multiple --env flags.",
    required: false,
    multiple: true,
    multipleNonGreedy: true,
    char: "e",
  })();
}

export function makeContainerEnvFileFlag() {
  return Flags.custom<string[]>({
    summary: "read environment variables from a file",
    description:
      "The file should contain lines in the format KEY=VALUE. Multiple files can be specified with multiple --env-file flags.",
    multiple: true,
    multipleNonGreedy: true,
    required: false,
  })();
}

export function makeContainerPublishAllFlag() {
  return Flags.boolean({
    summary: "publish all ports that are defined in the image",
    description:
      "Automatically publish all ports that are exposed by the container image to random ports on the host.",
    required: false,
    char: "P",
  });
}

export const containerVolumeFormatDescription =
  "Needs to be in the format <host-path>:<container-path>. " +
  "If you specify a file path as volume, this will mount a path from your hosting environment's file system (NOT your local file system) into the container. " +
  "You can also specify a named volume, which needs to be created beforehand.";

export function makeContainerDescriptionFlagOptions(summary: string) {
  return Flags.custom<string>({
    summary,
    description: "This helps identify the container's purpose or contents.",
    required: false,
  })();
}

export function makeContainerEntrypointFlagOptions(
  options: ContainerStringFlagOptions,
) {
  return Flags.custom<string>({
    summary: options.summary,
    description: options.description,
    required: false,
  })();
}

export function makeContainerPublishFlagOptions(
  options: ContainerPublishFlagOptions,
) {
  return Flags.custom<string[]>({
    summary: options.summary,
    description: options.description,
    required: false,
    multiple: true,
    multipleNonGreedy: true,
    char: options.char,
  })();
}

export function makeContainerVolumeFlagOptions(
  options: ContainerVolumeFlagOptions,
) {
  return Flags.custom<string[]>({
    summary: options.summary,
    description: options.description + containerVolumeFormatDescription,
    required: false,
    char: "v",
    multiple: true,
    multipleNonGreedy: true,
  })();
}
