import { createContext, useContext } from "react";
import { MittwaldAPIV2Client } from "@mittwald/api-client";

export interface RenderContext {
  apiClient: MittwaldAPIV2Client;
}

export const renderContext = createContext({} as any);

export const RenderContextProvider = renderContext.Provider;

export const useRenderContext = (): RenderContext => useContext(renderContext);
