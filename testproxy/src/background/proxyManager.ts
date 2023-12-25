import { Storage } from "@plasmohq/storage";
import StorageKeys from "~constants/storageKeys";
import type { ProxyData, ProxyServer } from "~types/proxyData";
const storage = new Storage();

const defaultSiteList = [
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
const defaultServer = {
  host: '127.0.0.1',
  port: '7890',
};

const defaultIsProxy = true;

export const setDefaultServer = async () => {
  await storage.set(StorageKeys.SERVER, defaultServer);
  return defaultServer;
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
  await storage.set(StorageKeys.SITE_LIST, defaultSiteList);
  return defaultSiteList;
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


// export const setDefaultProxyPacScript = async () => {
//   const pacScript = generatePacScript({ siteList: defaultSiteList, server: defaultServer });
//   await storage.set(StorageKeys.PAC_SCRIPT, pacScript);
//   return pacScript;
// };

// export const initDirectProxyPacScript = async () => {
//   const pacScript = "var FindProxyForUrl = function(url, host){return 'DIRECT';}";
//   await storage.set(StorageKeys.PAC_SCRIPT_DIRECT, pacScript);
//   return pacScript;
// };

// export const getDirectPacScript = async (): Promise<string | undefined> => {
//   return await storage.get(StorageKeys.PAC_SCRIPT_DIRECT) as string;
// };

// export const getPacScript = async (): Promise<string | undefined> => {
//   return await storage.get(StorageKeys.PAC_SCRIPT) as string;
// };

// export const updatePacScript = async () => {
//   let server = await getServer();
//   if (!server) return false;
//   let siteList = await getSiteList();
//   if (!siteList) return false;
//   const pacScript = generatePacScript({ siteList, server });
//   await storage.set(StorageKeys.PAC_SCRIPT, pacScript);
//   return true;
// };

const generatePacScript = (proxyData: ProxyData) => {
  let pacScriptList = ["var FindProxyForURL = function(url,host){if("];
  const shExpMatchList = proxyData.siteList.map(site => `shExpMatch(url, '${site.replace('.', '\\.')}')`);
  pacScriptList.push(shExpMatchList.join("||"));
  pacScriptList.push("){return 'PROXY " + proxyData.server + "';}return 'DIRECT';}");
  const pacScript = pacScriptList.join('');
  return pacScript;
};


export const setDefaultIsProxy = async () => {
  await storage.set(StorageKeys.ISPROXY, defaultIsProxy);
  return defaultIsProxy;
};

export const getIsProxy = async (): Promise<boolean | undefined> => {
  return await storage.get(StorageKeys.ISPROXY) as boolean;
};

export const switchIsProxy = async (isOpen: boolean) => {
  if (isOpen)
    await storage.set(StorageKeys.ISPROXY, true);
  else
    await storage.set(StorageKeys.ISPROXY, false);
};


export const setChromeProxy = (pac: string) => {
  const config = {
    mode: "pac_script",
    pacScript: {
      data: pac
    }
  };
  chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () { });
};


export const initDefaultProxy = async () => {
  await setDefaultIsProxy();
  const server = await setDefaultServer();
  const siteList = await setDefaultSiteList();
  const pacScript = generatePacScript({ siteList, server });
  setChromeProxy(pacScript);
};

export const initProxy = async () => {
  let server = await getServer();
  if (!server)
    server = await setDefaultServer();
  let siteList = await getSiteList();
  if (!siteList)
    siteList = await setDefaultSiteList();
  const pacScript = generatePacScript({ siteList, server });
  setChromeProxy(pacScript);
};

export const directProxy = async () => {
  const directPacScript = "var FindProxyForUrl = function(url, host){return 'DIRECT';}";
  setChromeProxy(directPacScript);
};
