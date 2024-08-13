import { getDefaultIngressForProject } from "../project/ingress.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { getProjectShortIdFromUuid } from "../project/shortId.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import React from "react";
import { Text } from "ink";
import { assertStatus } from "@mittwald/api-client-commons";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { projectFlags } from "../project/flags.js";
import {
  ProcessFlags,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import {
  FlagInput,
  OptionFlag,
  OutputFlags,
} from "@oclif/core/lib/interfaces/parser.js";
import FlagSetBuilder from "../../context/FlagSetBuilder.js";
import { contextIDNormalizers } from "../../context/Context.js";
import { generatePasswordWithSpecialChars } from "../../util/password/generatePasswordWithSpecialChars.js";
import { waitFlags } from "../../wait.js";

async function normalize(
  apiClient: MittwaldAPIV2Client,
  appInstallationId: string,
): Promise<string> {
  const appInstallations = await apiClient.app.getAppinstallation({
    appInstallationId,
  });
  assertStatus(appInstallations, 200);

  return appInstallations.data.id;
}

contextIDNormalizers["installation-id"] = normalize;

export const {
  flags: appInstallationFlags,
  args: appInstallationArgs,
  withId: withAppInstallationId,
} = new FlagSetBuilder("installation", "i", {
  displayName: "app installation",
  normalize,
  expectedShortIDFormat: {
    pattern: /^a-.*/,
    display: "a-XXXXXX",
  },
}).build();

export type AvailableFlagName = keyof AvailableFlags;

type AvailableFlags = typeof waitFlags & {
  version: OptionFlag<string>;
  host: OptionFlag<string | undefined>;
  "admin-user": OptionFlag<string | undefined>;
  "admin-email": OptionFlag<string | undefined>;
  "admin-pass": OptionFlag<string | undefined>;
  "admin-firstname": OptionFlag<string | undefined>;
  "admin-lastname": OptionFlag<string | undefined>;
  "site-title": OptionFlag<string | undefined>;
  "shop-email": OptionFlag<string | undefined>;
  "shop-lang": OptionFlag<string | undefined>;
  "shop-currency": OptionFlag<string | undefined>;
  "install-mode": OptionFlag<string>;
  "document-root": OptionFlag<string>;
  "opensearch-host": OptionFlag<string>;
  "opensearch-port": OptionFlag<string>;
  entrypoint: OptionFlag<string | undefined>;
};

function buildFlagsWithDescription(appName: string): AvailableFlags {
  return {
    version: Flags.string({
      required: true,
      summary: `version of ${appName} to be installed.`,
      description: `Specify the version in which your ${appName} will be installed. 
      If unspecified, the ${appName} will be installed in the latest available version.`,
      default: "latest",
    }),
    host: Flags.string({
      required: false,
      summary: `host to initially configure your ${appName} installation with; needs to be created separately.`,
      description: `Specify a host which will be used during the installation and as an initial host for the ${appName} configuration.
      If unspecified, the default host for the given project will be used. 
      This does not change the target of the used host and can be changed later by configuring the host and your ${appName} installation.`,
      default: undefined,
    }),
    "admin-user": Flags.string({
      required: false,
      summary: "Username for your administrator user.",
      description: `Username of the first administrator user which will be created during the ${appName} installation. 
      If unspecified, an adequate username will be generated.
      After the installation is finished, the username can be changed and additional administrator users can be created.`,
      default: undefined,
    }),
    "admin-email": Flags.string({
      required: false,
      summary: "email address of your administrator user.",
      description: `email address that will be used for the first administrator user that is created during the ${appName} installation.
      If unspecified, email address of your mStudio account will be used. This email address can be changed after the installation is finished.`,
      default: undefined,
    }),
    "admin-pass": Flags.string({
      required: false,
      summary: "password of your administrator user.",
      description: `The password that will be used for the first administrator user that is created during the ${appName} installation.
      If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after the installation is finished`,
      default: undefined,
    }),
    "admin-firstname": Flags.string({
      required: false,
      summary: "first name of your administrator user.",
      description: `The first name that will be used for the first administrator user that is created during the ${appName} installation.
      If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation is finished.`,
      default: undefined,
    }),
    "admin-lastname": Flags.string({
      required: false,
      summary: "Lastname of your administrator user.",
      description: `The last name that will be used for the first administrator user that is created during the ${appName} installation.
      If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is finished.`,
      default: undefined,
    }),
    "site-title": Flags.string({
      required: false,
      summary: `site title for your ${appName} installation.`,
      description: `The site title for this ${appName} installation. It is also the title shown in the app overview in the mStudio and the CLI.
      If unspecified, the application name and the given project ID will be used. The title can be changed after the installation is finished`,
      default: undefined,
    }),
    "shop-email": Flags.string({
      required: false,
      summary: `email address your ${appName} will be working with.`,
      description: `The email address your ${appName} installation will be using for correspondence with end users.
      If unspecified, your mStudio account email will be used. This email address can be changed after the installation is finished.`,
      default: undefined,
    }),
    "shop-lang": Flags.string({
      required: false,
      summary: `language your ${appName} will be working with.`,
      description: `The default language your ${appName} installation will be using. The front- and back end will be displayed using the given language.
      If unspecified, this will default to German (de_DE). The language can be changed after the installation is finished.`,
      default: undefined,
    }),
    "shop-currency": Flags.string({
      required: false,
      summary: `Currency your ${appName} will be working with.`,
      description: `The default currency your ${appName} shop communicates prices and calculates transactions with.
      If unspecified, this will default to EUR(€). The currency can be changed after the installation is finished.`,
      default: undefined,
    }),
    "install-mode": Flags.string({
      required: true,
      summary: `The installation mode your ${appName} will be installed with.`,
      description: `${appName} can be installed in one of two different ways: either as a composer project or in a more manual fashion using the source directory and the ${appName} console install wizard.
      If unspecified, this will default to a composer-based installation. This can not be changed later.`,
      options: ["composer", "symlink"],
      default: "composer",
    }),
    "document-root": Flags.string({
      required: true,
      summary: `the document root from which your ${appName} will be served (relative to the installation path)`,
      description:
        "This is the document root from which the files of your application will be served by the web server. This directory is specified relative to the installation path.",
      default: "/",
    }),
    "opensearch-host": Flags.string({
      required: true,
      summary: `the OpenSearch instance host which your ${appName} will try to connect to`,
      description:
        "This is the host of an existing OpenSearch instance which your application will have to connect to during installation." +
        "This has to be a valid connection otherwise the installation will fail.",
    }),
    "opensearch-port": Flags.string({
      required: true,
      summary: `the OpenSearch instance port which your ${appName} will try to connect to`,
      description:
        "This is the port of an existing OpenSearch instance which your application will have to connect to during installation." +
        "This has to be a valid connection otherwise the installation will fail.",
    }),
    entrypoint: Flags.string({
      summary: `the command that should be used to start your ${appName} application.`,
      description:
        "This is the command that should be used to start your application; the app is required to run in the foreground, and to listen on the port specified by the PORT environment variable.",
      required: false,
      default: undefined,
    }),
    ...waitFlags,
  };
}

export type RelevantFlags<TFlags extends readonly AvailableFlagName[]> =
  ProcessFlags & Pick<AvailableFlags, TFlags[number]>;
export type RelevantFlagInput<TFlags extends readonly AvailableFlagName[]> =
  FlagInput<RelevantFlags<TFlags>>;

export function provideSupportedFlags<
  TFlagNames extends readonly AvailableFlagName[],
>(
  requestedFlagNames: TFlagNames,
  appName: string,
): RelevantFlagInput<TFlagNames> {
  const availableFlags: AvailableFlags = buildFlagsWithDescription(appName);

  const supportedFlags = requestedFlagNames.reduce(
    (collector, currentValue) => {
      return {
        ...collector,
        [currentValue]: availableFlags[currentValue],
      };
    },
    {} as Pick<AvailableFlags, TFlagNames[number]>,
  );
  const flagsToReturn = {
    ...projectFlags,
    ...processFlags,
    ...supportedFlags,
  };

  return flagsToReturn as RelevantFlagInput<TFlagNames>;
}

export async function autofillFlags(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  necessaryFlags: readonly AvailableFlagName[],
  flags: Partial<OutputFlags<RelevantFlagInput<AvailableFlagName[]>>>,
  projectId: string,
  appName: string,
): Promise<void> {
  const ownUser = await apiClient.user.getOwnAccount();
  assertStatus(ownUser, 200);

  // Version
  if (necessaryFlags.includes("version") && !flags.version) {
    flags.version = "latest";
  }

  // Host
  if (necessaryFlags.includes("host") && !flags.host) {
    flags.host =
      "https://" + (await getDefaultIngressForProject(apiClient, projectId));
    process.addInfo(
      <Text>
        Using default Host <Value>{flags["host"]}</Value>
      </Text>,
    );
  }

  // Title
  if (necessaryFlags.includes("site-title") && !flags["site-title"]) {
    flags["site-title"] =
      appName + " " + (await getProjectShortIdFromUuid(apiClient, projectId));
  }

  // Admin User
  if (necessaryFlags.includes("admin-user") && !flags["admin-user"]) {
    if (ownUser.data.person) {
      flags["admin-user"] =
        ownUser.data.person.firstName.charAt(0).toLowerCase() +
        ownUser.data.person.lastName.toLowerCase();
    } else {
      flags["admin-user"] = await getProjectShortIdFromUuid(
        apiClient,
        projectId,
      );
    }
    process.addInfo(
      <Text>
        Using generated Admin User: <Value>{flags["admin-user"]}</Value>
      </Text>,
    );
  }

  // Admin Pass
  if (necessaryFlags.includes("admin-pass") && !flags["admin-pass"]) {
    flags["admin-pass"] = generatePasswordWithSpecialChars();

    process.addInfo(
      <Text>
        Using generated random Admin Pass: <Value>{flags["admin-pass"]}</Value>
      </Text>,
    );
  }

  // Admin Firstname
  if (necessaryFlags.includes("admin-firstname") && !flags["admin-firstname"]) {
    if (ownUser.data.person) {
      flags["admin-firstname"] = ownUser.data.person.firstName;
    } else {
      flags["admin-firstname"] = "Max";
    }
    process.addInfo(
      <Text>
        Using mStudio firstname as Admin firstname (
        <Value>{flags["admin-firstname"]}</Value>)
      </Text>,
    );
  }

  // Admin Lastname
  if (necessaryFlags.includes("admin-lastname") && !flags["admin-lastname"]) {
    if (ownUser.data.person) {
      flags["admin-lastname"] = ownUser.data.person.lastName;
    } else {
      flags["admin-lastname"] = "Mustermann";
    }
    process.addInfo(
      <Text>
        Using mStudio lastname as Admin lastname (
        <Value>{flags["admin-lastname"]}</Value>)
      </Text>,
    );
  }

  // Admin E-Mail
  if (necessaryFlags.includes("admin-email") && !flags["admin-email"]) {
    flags["admin-email"] = ownUser.data.email;
    process.addInfo(
      <Text>
        Using mStudio email as Admin email (
        <Value>{flags["admin-email"]}</Value>)
      </Text>,
    );
  }

  // Shop E-Mail
  if (necessaryFlags.includes("shop-email") && !flags["shop-email"]) {
    flags["shop-email"] = ownUser.data.email;
    process.addInfo(
      <Text>
        Using mStudio email as Shop email (<Value>{flags["shop-email"]}</Value>)
      </Text>,
    );
  }

  // Shop Language Code
  if (necessaryFlags.includes("shop-lang") && !flags["shop-lang"]) {
    if (appName.toLowerCase().includes("magento")) {
      flags["shop-lang"] = "de_DE";
    } else {
      flags["shop-lang"] = "de-DE";
    }
    process.addInfo(<Text>Using default shop language 'de_DE'.</Text>);
  }

  // Shop Currency
  if (necessaryFlags.includes("shop-currency") && !flags["shop-currency"]) {
    flags["shop-currency"] = "EUR";
    process.addInfo(<Text>Using default shop currency '€'.</Text>);
  }
}
