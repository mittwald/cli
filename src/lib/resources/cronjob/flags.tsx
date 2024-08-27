import { Flags } from "@oclif/core";
import { InferredFlags } from "@oclif/core/lib/interfaces/index.js";

export const cronjobFlags = {
  description: Flags.string({
    description: "Set cron job description",
  }),
  interval: Flags.string({
    description: "Set cron job execution interval",
  }),
  disable: Flags.boolean({
    description: "Disable cron job automated execution",
    exclusive: ["enable"],
  }),
  enable: Flags.boolean({
    description: "Enable cron job automated execution",
    exclusive: ["disable"],
  }),
  email: Flags.string({
    description: "Set target email to send error messages to",
  }),
  timeout: Flags.integer({
    description: "Set timeout in seconds after wich the process is killed",
  }),
  url: Flags.string({
    description: "Set url to use on cron job execution",
  }),
  command: Flags.string({
    description: "Set file and parameters to execute on cron job execution",
  }),
  interpreter: Flags.string({
    description: "Set interpreter to use for execution",
    options: ["bash", "php"],
  }),
};

export type CronjobFlags = InferredFlags<typeof cronjobFlags>;
