export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { getIsConfigureProxy, getIsListenErrReq, getProxyMode, getServer, getSiteList } from "~background/proxyManager";
import type { ProxyData } from "~types/proxyData";

const handler: PlasmoMessaging.MessageHandler<any, ProxyData> = async (req, res) => {
  // console.log(storage);
  const siteList = await getSiteList();
  const server = await getServer();
  const proxyMode = await getProxyMode();
  const isConfigureProxy = await getIsConfigureProxy();
  console.log("isConfigureProxy isConfigureProxy", isConfigureProxy);
  const isListenErrReq = await getIsListenErrReq();
  console.log("isListenErrReq isListenErrReq", isListenErrReq);
  res.send({
    siteList,
    server,
    proxyMode,
    isConfigureProxy,
    isListenErrReq
  });
};

export default handler;