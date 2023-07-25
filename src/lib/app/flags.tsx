import { getDefaultIngressForProject } from "../project/ingress.js";
import { Value } from "../../rendering/react/components/Value.js";
import { getProjectShortIdFromUuid } from "../project/shortId.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import crypto from "crypto";
import React from "react";
import { Text } from "ink";
import { assertStatus } from "@mittwald/api-client-commons";
import { ProcessRenderer } from "../../rendering/react/process.js";

export async function autofillFlags(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  necessaryFlags: string[],
  flags: any,
  projectId: string,
  appName: string,
) {
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

  // Install Mode
  if (necessaryFlags.includes("install-mode") && !flags["install-mode"]) {
    flags["install-mode"] = "composer";
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
    flags["admin-pass"] = crypto
      .randomBytes(32)
      .toString("ascii")
      .substring(0, 32);

    process.addInfo(
      <Text>
        Using generated random Admin Pass: <Value>{flags["admin-pass"]}</Value>
      </Text>,
    );
  }

  // Admin Firstname
  if (necessaryFlags.includes("admin-firstname") && !flags["admin-firstname"]) {
    // @ts-ignore
    flags["admin-firstname"] = ownUser.data.person.firstName;
    process.addInfo(
      <Text>
        Using mStudio firstname as Admin firstname (
        <Value>{flags["admin-firstname"]}</Value>)
      </Text>,
    );
  }

  // Admin Lastname
  if (necessaryFlags.includes("admin-lastname") && !flags["admin-lastname"]) {
    // @ts-ignore
    flags["admin-lastname"] = ownUser.data.person.lastName;
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
  if (necessaryFlags.includes("shop-language") && !flags["shop-language"]) {
    flags["shop-language"] = "de-DE";
    process.addInfo(<Text>Using default shop language 'de_DE'.</Text>);
  }

  // Shop Currency
  if (necessaryFlags.includes("shop-currency") && !flags["shop-currency"]) {
    flags["shop-currency"] = "EUR";
    process.addInfo(<Text>Using default shop currency '€'.</Text>);
  }

  return flags;
}
