import * as uuid from "uuid";

/**
 * Generate a sample extension manifest file.
 *
 * This function generates a sample extension manifest file for mStudio
 * extensions. The generated file contains a lot of comments to help the user
 * understand the purpose of each field.
 */
export function generateInitialExtensionManifest(): string {
  // Note: This is a hardcoded string (instead of a yaml object) because we
  // want this output to contain lots of comments.
  return `
# This is a sample manifest file for an mStudio extension.
# You can use this file as a starting point for your own extension.
#
# Publish your extension to the marketplace by running:
#   $ mittwald contributor extension deploy

# This is the name of your extension. It will be displayed in the marketplace.
name: my-extension

# The extension ID. This is a unique identifier for your extension. It must be
# unique across all extensions in the marketplace.
id: ${uuid.v4()}

# Your contributor ID. This is the ID of your mStudio organization. The
# organization must be registered as a contributor in the marketplace. See
# https://developer.mittwald.de/docs/v2/contribution/how-to/become-contributor/
# for more information.
contributorId: TODO

# The description of your extension. This will be displayed in the marketplace.
description: TODO

# The detailed description of your extension. This will be displayed in the
# marketplace. You will need to provide a plain text and a markdown version of the
# description.
detailedDescriptions:
  de:
    markdown: TODO
    plain: TODO
  en:
    markdown: TODO
    plain: TODO

# The subtitle of your extension. This will be displayed in the marketplace.
subTitle:
  de: TODO
  en: TODO
  
# The tags of your extension. This will be used to categorize your extension in
# the marketplace.
tags:
  - TODO
  
# The scopes of your extension. This will be used to determine the permissions
# of your extension. See https://developer.mittwald.de/docs/v2/contribution/overview/concepts/scopes/
# for more information.
scopes:
  - user:read

# The support information of your extension. This will be displayed in the
# marketplace.
support:
  email: todo@mstudio-extension.example
  phone: +49 0000 000000
  
# The external frontends of your extension. This will be used to determine the
# URLs of your extension. See https://developer.mittwald.de/docs/v2/contribution/overview/concepts/external-frontend/
# for more information.
externalFrontends:
  - name: example
    url: https://mstudio-extension.example/auth/oneclick?atrek=:accessTokenRetrievalKey&userId=:userId&instanceID=:extensionInstanceId

# The frontend fragments of your extension. This will be used to determine the
# URLs of your extension.
frontendFragments:
  foo:
    url: https://mstudio-extension.example/
    
# The webhook URLs of your extension. This will be used to determine the
# URLs of your extension. See https://developer.mittwald.de/docs/v2/contribution/overview/concepts/lifecycle-webhooks/
# for more information.
webhookUrls:
  extensionAddedToContext:
    url: https://mstudio-extension.example/webhooks
  extensionInstanceUpdated:
    url: https://mstudio-extension.example/webhooks
  extensionInstanceSecretRotated:
    url: https://mstudio-extension.example/webhooks
  extensionInstanceRemovedFromContext:
    url: https://mstudio-extension.example/webhooks
`.trim();
}
