export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
import type { ProxyServer } from "~types/proxyData";
const storage = new Storage();

const handler: PlasmoMessaging.MessageHandler<ProxyServer, boolean> = async (req, res) => {
  // console.log("req.body", req.body);
  const serverString = req.body.host + ":" + req.body.port;
  await storage.set('server', serverString);
  res.send(true);
};

export default handler;