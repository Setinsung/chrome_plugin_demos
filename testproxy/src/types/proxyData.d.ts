export interface ProxyData {
  siteList?: string[];
  server?: ProxyServer;
  proxyMode?: ProxyMode;
  isListenErrReq?: boolean;
  isConfigureProxy?: boolean;
}
export interface ProxyServer {
  host: string;
  port: string;
}

export type ProxyMode = "manual" | "direct" | "system";
