export interface ProxyData {
  siteList: string[] | undefined;
  server: ProxyServer | undefined;
}
export interface ProxyServer {
  host: string;
  port: string;
}

export type ProxyMode = "pac" | "direct" | "system";
