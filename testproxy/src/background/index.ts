export { };
import { Storage } from "@plasmohq/storage";
const storage = new Storage();
console.log(
  "Live now; make now always the most precious time. Now will never come again.",
);

// const testStorage = async () => {
//   const storage = new Storage();
//   await storage.set("key", "value");
//   const data = await storage.get("key"); // "value"
//   console.log('data', data);
//   await storage.set("capt", { color: "red" });
//   const data2 = await storage.get("capt"); // { color: "red" }
//   console.log("data2", data2);
// };
// testStorage();
class ProxyManager {

  static defaultSiteList: string[] = [
    '*amazon\.com*',
    '*facebook\.com*',
    '*facebook\.net*',
    '*twitter\.com*',
    '*twimg\.com*',
    '*github\.com*',
    '*wikipedia\.org*',
    '*gstatic\.com*',
    '*chrome\.com*',
    '*googleapis\.com*',
    '*gmail\.com*',
    '*googleusercontent\.com*',
    '*google\.com*'
  ];
  static host: '127.0.0.1';
  static port: '7890';

  public static async on() {
    console.log("ProxyManager on");
    const pacScript = await this.getPacScript();
    this.set(pacScript);
  }
  public static off() {
    console.log("ProxyManager off");
    const pacScript = "var FindProxyForUrl = function(url, host){return 'DIRECT';}";
    this.set(pacScript);
  }
  private static async getPacScript(reCreate?: boolean) {
    let pacScript = await storage.get('pacScript');
    if (!pacScript || reCreate) {
      // 没有则使用默认server和site list生成
      pacScript = await this.createPacScript();
    }
    return pacScript;
  }

  private static set(pac: string) {
    const config = {
      mode: "pac_script",
      pacScript: {
        data: pac
      }
    };
    chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () { });
    console.log('chrome', config);
  }

  private static async createPacScript() {
    let pacScriptList = ["var FindProxyForURL = function(url,host){if("];
    let server = await this.getServer();
    let siteList = await this.getSiteList();
    const itemList: string[] = siteList.map(site => `shExpMatch(url, '${site.replace('.', '\\.')}')`);
    pacScriptList.push(itemList.join("||"));
    pacScriptList.push("){return 'PROXY " + server + "';}return 'DIRECT';}");
    const pacScript = pacScriptList.join('');
    await storage.set('pacScript', pacScript);
    return pacScript;
  }

  private static async getServer() {
    let server = await storage.get('server');
    if (!server) {
      // 没有，使用默认数据生成
      server = await this.createServer(null, null);
    }
    return server;
  }

  private static async getSiteList() {
    const siteListJson = await storage.get('siteList');
    let siteList: string[];
    if (!siteListJson) {
      await storage.set('siteList', JSON.stringify(this.defaultSiteList));
      siteList = this.defaultSiteList;
    } else {
      siteList = JSON.parse(siteListJson);
    }
    return siteList;
  }

  private static async createServer(host?: string, port?: string) {
    // host = host ?? this.host;
    host = host ?? '127.0.0.1';
    // port = port ?? this.port;
    port = port ?? '7890';
    const server = host + ':' + port;
    await storage.set('server', server);
    return server;
  }
}

const initBack = async () => {
  // await storage.clear();
  // const res = await storage.getAll();
  // console.log('res', res);
  console.log('initBack');
  checkSwitch();
};
const checkSwitch = async () => {
  const isSwitch = await storage.get('switch');
  if (!isSwitch || isSwitch == 'true') {
    await storage.set('switch', 'true');
    ProxyManager.on();
  } else {
    ProxyManager.off();
  }
};
initBack();