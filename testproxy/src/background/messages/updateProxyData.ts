export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { checkProxy, updateIsConfigureProxy, updateIsListenErrReq, updateServer, updateSiteList } from "~background/proxyManager";
import type { ProxyData } from "~types/proxyData";

const handler: PlasmoMessaging.MessageHandler<ProxyData, boolean> = async (req, res) => {
  // console.log("req.body", req.body);
  const { server, siteList, isConfigureProxy, isListenErrReq } = req.body;
  if (!server && !siteList && isConfigureProxy === undefined && isListenErrReq === undefined) {
    res.send(false);
    return;
  }
  server && await updateServer(server);
  siteList && await updateSiteList(siteList);
  (isConfigureProxy !== undefined) && await updateIsConfigureProxy(isConfigureProxy);
  (isListenErrReq !== undefined) && await updateIsListenErrReq(isListenErrReq);
  if (server || siteList)
    await checkProxy();
  res.send(true);
};

export default handler;