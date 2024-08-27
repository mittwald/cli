import { Flags } from "@oclif/core";

export const cronjobFlagDefinitions = {
  description: Flags.custom<string>({
    description: "Set cron job description",
  }),
  interval: Flags.custom<string>({
    description: "Set cron job execution interval",
  }),
  active: Flags.custom<boolean>({
    description: "Set whether automatic execution is active",
  }),
  email: Flags.custom<string>({
    description: "Set target email to send error messages to",
  }),
  timeout: Flags.custom<number>({
    description: "Set timeout in seconds after wich the process is killed",
  }),
  url: Flags.custom<string>({
    description: "Set url to use on cron job execution",
  }),
  command: Flags.custom<string>({
    description: "Set file and parameters to execute on cron job execution",
  }),
  interpreter: Flags.custom<string>({
    description: "Set interpreter to use for execution",
    options: ["bash", "php"],
  }),
};
