export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { addOneSite, checkProxy} from "~background/proxyManager";

const handler: PlasmoMessaging.MessageHandler<string, boolean> = async (req, res) => {
  // console.log("req.body", req.body);
  const result = await addOneSite(req.body);
  if(!result) res.send(false);
  await checkProxy();
  res.send(true);
};

export default handler;