export { };
import { directProxy, getIsProxy, initProxy, switchIsProxy } from "./proxyManager";

console.log(
  "Live now; make now always the most precious time. Now will never come again.",
);

const init = async () => {
  console.log("init proxy");
  let isProxy = await getIsProxy();
  if (isProxy === undefined) {
    await switchIsProxy(true);
    isProxy = true;
  }
  if (isProxy) {
    console.log("open proxy");
    await initProxy();
  } else {
    console.log("close proxy");
    await directProxy();
  }
};

init();