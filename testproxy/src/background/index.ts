export { };
import { checkProxy } from "./proxyManager";

console.log(
  "Live now; make now always the most precious time. Now will never come again.",
);

const init = async () => {
  await checkProxy();
};

init();