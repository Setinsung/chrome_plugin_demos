import { Storage } from "@plasmohq/storage";
import StorageKeys from "~constants/storageKeys";
import type { ProxyData, ProxyMode, ProxyServer } from "~types/proxyData";
const storage = new Storage();

const DEFAULT_SITE_LIST = [
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

const DEFAULT_SERVER = {
  host: '127.0.0.1',
  port: '7890',
};

const DEFAULT_PROXY_MODE: ProxyMode = "manual";

export const setDefaultServer = async () => {
  await storage.set(StorageKeys.SERVER, DEFAULT_SERVER);
  return DEFAULT_SERVER;
};

export const getServer = async (): Promise<ProxyServer | undefined> => {
  return await storage.get(StorageKeys.SERVER) as ProxyServer;
};

export const updateServer = async (serverInput: ProxyServer) => {
  serverInput.host = serverInput.host?.trim();
  serverInput.port = serverInput.port?.trim();
  if (!serverInput.host || !serverInput.port) {
    return false;
  }
  await storage.set(StorageKeys.SERVER, serverInput);
  return true;
};


export const setDefaultSiteList = async () => {
  await storage.set(StorageKeys.SITE_LIST, DEFAULT_SITE_LIST);
  return DEFAULT_SITE_LIST;
};

export const getSiteList = async (): Promise<string[] | undefined> => {
  return await storage.get(StorageKeys.SITE_LIST) as string[];
};

export const updateSiteList = async (siteListInput: string[]) => {
  if (!siteListInput)
    return false;
  await storage.set(StorageKeys.SITE_LIST, siteListInput);
  return true;
};

export const addOneSite = async (siteInput: string) => {
  if (!siteInput)
    return false;
  let siteList = await getSiteList();
  const siteIndex = siteList.findIndex((site) => site === siteInput);
  if (siteIndex !== -1) return false;
  const formattedSite = `*${siteInput}*`;
  siteList = [...siteList, formattedSite];
  await storage.set(StorageKeys.SITE_LIST, siteList);
  return true;
};


export const deleteOneSite = async (siteInput: string) => {
  if (!siteInput) {
    return false;
  }
  try {
    let siteList = await getSiteList();
    const siteIndex = siteList.findIndex((site) => site === siteInput);
    if (siteIndex === -1) return false;
    siteList.splice(siteIndex, 1);
    await storage.set(StorageKeys.SITE_LIST, siteList);
    return true;
  } catch (error) {
    console.error('Error deleting site:', error);
    return false;
  }
};



const generatePacScript = (proxyData: ProxyData) => {
  let pacScriptList = ["var FindProxyForURL = function(url,host){if("];
  console.log("generatePacScript proxyData.siteList", proxyData.siteList);
  const shExpMatchList = proxyData.siteList.map(site => `shExpMatch(url, '${site.replace('.', '\\.')}')`);
  pacScriptList.push(shExpMatchList.join("||"));
  const serverString = proxyData.server.host + ":" + proxyData.server.port;
  pacScriptList.push("){return 'PROXY " + serverString + "';}return 'DIRECT';}");
  const pacScript = pacScriptList.join('');
  return pacScript;
};


export const setDefaultProxyMode = async () => {
  await storage.set(StorageKeys.PROXY_MODE, DEFAULT_PROXY_MODE);
  return DEFAULT_PROXY_MODE;
};

export const getProxyMode = async (): Promise<ProxyMode | undefined> => {
  return await storage.get(StorageKeys.PROXY_MODE) as ProxyMode;
};

export const updateProxyMode = async (proxyMode: ProxyMode) => {
  await storage.set(StorageKeys.PROXY_MODE, proxyMode);
};


const setChromeProxy = (mode: ProxyMode, pac?: string) => {
  let config: any;
  switch (mode) {
    case "manual":
      console.log("pac mode");
      if (!pac) {
        console.error('PAC script is required for proxy mode.');
        return;
      }
      config = {
        mode: "pac_script",
        pacScript: {
          data: pac
        }
      };
      break;
    case "direct":
      console.log("direct mode");
      config = {
        mode: "direct"
      };
      break;
    case "system":
      console.log("system mode");
      config = {
        mode: "system"
      };
      break;
    default:
      console.error('Invalid proxy mode specified.');
      return;
  }

  chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () { });
};


export const setDefaultPacProxy = async () => {
  await setDefaultProxyMode();
  const server = await setDefaultServer();
  const siteList = await setDefaultSiteList();
  const pacScript = generatePacScript({ siteList, server });
  setChromeProxy("manual", pacScript);
};

export const setPacProxy = async () => {
  let server = await getServer();
  if (!server)
    server = await setDefaultServer();
  let siteList = await getSiteList();
  if (!siteList)
    siteList = await setDefaultSiteList();
  const pacScript = generatePacScript({ siteList, server });
  console.log("setPacProxy pacScript", pacScript);
  setChromeProxy("manual", pacScript);
};


export const checkProxy = async (proxyModeInput?: ProxyMode) => {
  let proxyMode: ProxyMode | undefined;
  if (!proxyModeInput) {
    proxyMode = await getProxyMode();
    if (!proxyMode) {
      await updateProxyMode(DEFAULT_PROXY_MODE);
      proxyMode = DEFAULT_PROXY_MODE;
    }
  } else {
    await updateProxyMode(proxyModeInput);
    proxyMode = proxyModeInput;
  }
  console.log("checkProxy proxyMode", proxyMode);
  switch (proxyMode) {
    case "manual":
      await setPacProxy();
      break;
    default:
      setChromeProxy(proxyMode);
      break;
  }
};