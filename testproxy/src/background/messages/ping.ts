export { };
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
const storage = new Storage();

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // const message = await querySomeApi(req.body.id)
  // const resp = await (await fetch("http://httpbin.org/get")).json();
  // console.log("background js resp", resp);
  console.log(storage);
  const data2 = await storage.get("capt"); // { color: "red" }
  console.log("data2", data2);
  console.log('req', req);
  res.send({
    data: 1
  });
};

export default handler;