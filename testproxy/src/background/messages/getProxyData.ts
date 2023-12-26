export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { getServer, getSiteList } from "~background/proxyManager";
import type { ProxyData } from "~types/proxyData";

const handler: PlasmoMessaging.MessageHandler<any, ProxyData> = async (req, res) => {
  // console.log(storage);
  const siteList = await getSiteList();
  const server = await getServer();
  console.log("getProxyData siteList", siteList);
  console.log("getProxyData server", server);
  res.send({
    siteList,
    server
  });
};

export default handler;