export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
import type { ProxyData } from "~types/proxyData";
const storage = new Storage();

const handler: PlasmoMessaging.MessageHandler<any, ProxyData> = async (req, res) => {
  // console.log(storage);
  const siteListString = await storage.get("siteList");
  const serverString = await storage.get("server");
  console.log("siteList", siteListString);
  console.log("serverString", serverString);
  const siteList = JSON.parse(siteListString) as string[];
  var splitedServer = serverString.split(":");
  var host = splitedServer[0];
  var port = splitedServer[1];
  res.send({
    siteList,
    server: {
      host,
      port
    }
  });
};

export default handler;