import { Flags } from "@oclif/core";

export const cronjobFlagDefinitions = {
  description: Flags.custom<string>({
    summary: "Set cron job description.",
    description:
      "This will be displayed as the cron jobs 'name' of the cron job in mStudio.",
  }),
  interval: Flags.custom<string>({
    summary: "Set the interval for cron jobs to run.",
    description:
      "Must be specified as a cron schedule expression. Defines the interval at which the cron job will be executed.",
  }),
  email: Flags.custom<string>({
    summary: "Set the target email to which error messages will be sent.",
    description:
      "If a cron job fails, a detailed error message will be sent to this email address.",
  }),
  url: Flags.custom<string>({
    summary: "Set the URL to use when running a cron job.",
    description:
      "Define a URL with protocol to which a request will be dispatched when the cron job is executed. For example: 'https://my-website.com/cron-job'. Not required if a command and interpreter is defined.",
  }),
  command: Flags.custom<string>({
    summary:
      "Specify the file and arguments to be executed when the cron job is run.",
    description:
      " Specifies a file to be executed with the specified interpreter. Additional arguments can be appended to the command to be passed to the script. Not required if a URL is given.",
  }),
  interpreter: Flags.custom<string>({
    options: ["bash", "php"],
    summary: "Set the interpreter to be used for execution.",
    description:
      "Must be either 'bash' or 'php'. Define the interpreter to be used to execute the previously defined command. The interpreter should match the corresponding command or script.",
  }),
  timezone: Flags.custom<string>({
    summary: "Set the timezone for the cron job.",
    description:
      "Specify the timezone in which the cron job should be executed. Use standard timezone identifiers (e.g., 'Europe/Berlin', 'America/New_York'). Defaults to UTC if not specified.",
  }),
};
