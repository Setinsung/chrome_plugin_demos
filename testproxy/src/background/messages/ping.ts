import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // const message = await querySomeApi(req.body.id)
  const resp = await (await fetch("http://httpbin.org/get")).json();
  console.log("background js resp", resp);
  res.send({
    resp
  });
};

export default handler;