export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { checkProxy } from "~background/proxyManager";
import type { ProxyMode } from "~types/proxyData";

const handler: PlasmoMessaging.MessageHandler<ProxyMode, boolean> = async (req, res) => {
  console.log("switchProxyMode", req.body);
  const proxyMode = req.body;
  await checkProxy(proxyMode);
  res.send(true);
};

export default handler;