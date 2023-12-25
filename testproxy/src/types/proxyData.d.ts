export interface ProxyData {
  siteList: string[];
  server: ProxyServer;
}
export interface ProxyServer {
  host: string;
  port: string;
}