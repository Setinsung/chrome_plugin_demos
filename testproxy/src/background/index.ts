export { };
import { checkProxy, setDefaultPacProxy } from "./proxyManager";

console.log(
  "Live now; make now always the most precious time. Now will never come again.",
);

const init = async () => {
  // await setDefaultPacProxy();
  await checkProxy();
};

init();