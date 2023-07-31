import { getDefaultIngressForProject } from "../project/ingress.js";
import { Value } from "../../rendering/react/components/Value.js";
import { getProjectShortIdFromUuid } from "../project/shortId.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import React from "react";
import { Text } from "ink";
import { assertStatus } from "@mittwald/api-client-commons";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { projectFlags } from "../project/flags.js";
import {
  ProcessFlags,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Flags, Args } from "@oclif/core";
import {
  BooleanFlag,
  FlagInput,
  OptionFlag,
  OutputFlags,
} from "@oclif/core/lib/interfaces/parser.js";
import { generatePasswordWithSpecialChars } from "../password.js";

export const appInstallationFlags = {
  "installation-id": Args.string({
    description: "ID of the app installation to get",
    required: true,
  }),
};

export type AvailableFlagName = keyof AvailableFlags;

interface AvailableFlags {
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
  wait: BooleanFlag<boolean | undefined>;
}

function buildFlagsWithDescription(appName: string): AvailableFlags {
  return {
    version: Flags.string({
      required: true,
      summary: `Version of the ${appName} to be installed.`,
      description: `Specify the Version in wich your ${appName} will be installed. 
      If none is given the ${appName} will be installed in the latest available Version.`,
      default: "latest",
    }),
    host: Flags.string({
      required: false,
      summary: `Host to initially configure your ${appName} installation with; needs to be created separately.`,
      description: `Specify a host which will be used during the installation and as an initial host for the ${appName} configuration.
      If not given the default host for the given Project will be used. 
      This does not change the target of the used Host and can be changed later by configuring the Host and your ${appName} installation.`,
    }),
    "admin-user": Flags.string({
      required: false,
      summary: "Username for your administrator-user.",
      description: `Username of the first administrator-user which will be created during the ${appName} installation. 
      If not given an adequate username will be created from your mStudio Account Data.
      After the installation is finished the Username can be changed and additional administrator-users can be created.`,
    }),
    "admin-email": Flags.string({
      required: false,
      summary: "E-Mail-Address of your administrator-user.",
      description: `E-Mail-Address that will correlate to the first administrator-user which will be created during the ${appName} installation.
      If not given your mStudio Account-E-Mail-Address will be used. This E-Mail-Address can be changed after the installation is finished.`,
    }),
    "admin-pass": Flags.string({
      required: false,
      summary: "Password of your administrator-user.",
      description: `Password that will correlate to the first administrator-user which will be created during the ${appName} installation.
      If not given a random secure Password will be generated and sent to stdout. This Password can be changed after the installation is finished`,
    }),
    "admin-firstname": Flags.string({
      required: false,
      summary: "Firstname of your administrator-user.",
      description: `Firstname that will correlate to the first administrator-user which will be created during the ${appName} installation.
      If none is given your mStudio Account-Firstname will be used. This Firstname can be changed after the installation is finished`,
    }),
    "admin-lastname": Flags.string({
      required: false,
      summary: "Lastname of your administrator-user.",
      description: `Lastname that will correlate to the first administrator-user which will be created during the ${appName} installation.
      If none is given your mStudio Account-Firstname will be used. This Lastname can be changed after the installation is finished`,
    }),
    "site-title": Flags.string({
      required: false,
      summary: `Site Title for your ${appName} installation.`,
      description: `Site Title which will be displayed in the Tab and at the top of the Frontend of your ${appName} installation.
      It is also the Title shown in the App-Overview in the mStudio.
      If none is given the Software Name and the given Project will be used. The Title can be changed after the installation is finished`,
    }),
    "shop-email": Flags.string({
      required: false,
      summary: `E-Mail-Address your ${appName} will be working with.`,
      description: `The E-Mail-Address your ${appName} shop will be using for correspondence..
      If not given your mStudio Account-E-Mail-Address will be used. This E-Mail-Address can be changed after the installation is finished.`,
    }),
    "shop-lang": Flags.string({
      required: false,
      summary: `Language your ${appName} will be working with.`,
      description: `The default Language your ${appName} shop will be using.
      The Front- and Backend will be displayed using the given language.
      If not given will default to German(de_DE). The language can be changed after the installation is finished.`,
    }),
    "shop-currency": Flags.string({
      required: false,
      summary: `Currency your ${appName} will be working with.`,
      description: `The default Currency your ${appName} shop communicates prices and calculates transactions with.
      If not given will default to EUR(€). The currency can be changed after the installation is finished.`,
    }),
    "install-mode": Flags.string({
      required: true,
      summary: `The installation variant your ${appName} will be installed with.`,
      description: `${appName} can be installed in one of two different ways.  your ${appName} shop communicates prices and calculates transactions with.
      Either as a composer project or in a more manual fashion using the source directory and the ${appName} console install wizard.
      If not given will default to composer installation. This can not be changed later.`,
      options: ["composer", "symlink"],
      default: "composer",
    }),
    wait: Flags.boolean({
      char: "w",
      description: `Wait for your ${appName} to be ready.`,
    }),
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
    json: Flags.boolean({}),
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
    flags["admin-firstname"] = ownUser.data.person!.firstName;
    process.addInfo(
      <Text>
        Using mStudio firstname as Admin firstname (
        <Value>{flags["admin-firstname"]}</Value>)
      </Text>,
    );
  }

  // Admin Lastname
  if (necessaryFlags.includes("admin-lastname") && !flags["admin-lastname"]) {
    flags["admin-lastname"] = ownUser.data.person!.lastName;
    process.addInfo(
      <Text>
        Using mStudio firstname as Admin lastname (
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
    flags["shop-lang"] = "de-DE";
    process.addInfo(<Text>Using default shop language 'de_DE'.</Text>);
  }

  // Shop Currency
  if (necessaryFlags.includes("shop-currency") && !flags["shop-currency"]) {
    flags["shop-currency"] = "EUR";
    process.addInfo(<Text>Using default shop currency '€'.</Text>);
  }
}
