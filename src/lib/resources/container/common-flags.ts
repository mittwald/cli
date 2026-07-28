import { Flags } from "@oclif/core";

export const containerEnvFlag = Flags.custom<string[]>({
  summary: "set environment variables in the container",
  description:
    "Format: KEY=VALUE or KEY. If only KEY is provided, the value is resolved from the caller environment (exported variables only). Multiple environment variables can be specified with multiple --env flags.",
  required: false,
  multiple: true,
  multipleNonGreedy: true,
  char: "e",
});

export const containerEnvFileFlag = Flags.custom<string[]>({
  summary: "read environment variables from a file",
  description:
    "The file should contain lines in the format KEY=VALUE. Multiple files can be specified with multiple --env-file flags.",
  multiple: true,
  multipleNonGreedy: true,
  required: false,
});

export const containerPublishAllFlag = Flags.boolean({
  summary: "publish all ports that are defined in the image",
  description:
    "Automatically publish all ports that are exposed by the container image to random ports on the host.",
  required: false,
  char: "P",
});

export const containerVolumeFormatDescription =
  "Needs to be in the format <host-path>:<container-path>. " +
  "If you specify a file path as volume, this will mount a path from your hosting environment's file system (NOT your local file system) into the container. " +
  "You can also specify a named volume, which needs to be created beforehand.";

export const containerDescriptionFlag = Flags.custom<string>({
  description: "This helps identify the container's purpose or contents.",
  required: false,
});

export const containerEntrypointFlag = Flags.custom<string>({
  required: false,
});

export const containerPublishFlag = Flags.custom<string[]>({
  required: false,
  multiple: true,
  multipleNonGreedy: true,
});

export const containerVolumeFlag = Flags.custom<string[]>({
  required: false,
  char: "v",
  multiple: true,
  multipleNonGreedy: true,
});
