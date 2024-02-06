import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { isUuid } from "./normalize_id.js";
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
import AppApp = MittwaldAPIV2.Components.Schemas.AppApp;
