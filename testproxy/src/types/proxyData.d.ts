export interface ProxyData {
  siteList?: string[];
  server?: ProxyServer;
  proxyMode?: ProxyMode;
}
export interface ProxyServer {
  host: string;
  port: string;
}

export type ProxyMode = "manual" | "direct" | "system";
