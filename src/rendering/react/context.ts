import { createContext, useContext } from "react";
import { MittwaldAPIV2Client } from "@mittwald/api-client";

export interface RenderContext {
  apiClient: MittwaldAPIV2Client;
  renderAsJson: boolean;
}

export const renderContext = createContext<RenderContext>({
  renderAsJson: true,
  apiClient: null as unknown as MittwaldAPIV2Client,
});

export const RenderContextProvider = renderContext.Provider;

export const useRenderContext = (): RenderContext => useContext(renderContext);
