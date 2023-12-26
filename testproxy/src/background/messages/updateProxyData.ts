export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { checkProxy, updateServer, updateSiteList } from "~background/proxyManager";
import type { ProxyData } from "~types/proxyData";

const handler: PlasmoMessaging.MessageHandler<ProxyData, boolean> = async (req, res) => {
  console.log("req.body", req.body);
  const { server, siteList } = req.body;
  if (!server && !siteList) {
    res.send(false);
    return;
  }
  server && await updateServer(server);
  siteList && await updateSiteList(siteList);
  await checkProxy();
  res.send(true);
};

export default handler;