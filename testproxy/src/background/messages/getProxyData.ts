export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { getProxyMode, getServer, getSiteList } from "~background/proxyManager";
import type { ProxyData } from "~types/proxyData";

const handler: PlasmoMessaging.MessageHandler<any, ProxyData> = async (req, res) => {
  // console.log(storage);
  const siteList = await getSiteList();
  const server = await getServer();
  const proxyMode = await getProxyMode();
  // console.log("getProxyData siteList", siteList);
  // console.log("getProxyData server", server);
  // console.log("getProxyData proxyMode", proxyMode);
  res.send({
    siteList,
    server,
    proxyMode
  });
};

export default handler;