import { type ReactNode, type MouseEventHandler, type FC, useState, useRef, useEffect, type ChangeEvent } from 'react';
import "../style.css";
import logo from "data-base64:~assets/icon.png";
import { sendToBackground } from "@plasmohq/messaging";
import type { ProxyData, ProxyMode, ProxyServer } from '~types/proxyData';



const IndexPopup = () => {
  const [server, setServer] = useState({
    host: "",
    port: ""
  });
  const [urlList, setUrlList] = useState<string[]>([]);

  const [proxyMode, setProxyMode] = useState<ProxyMode>("manual");

  const [newSite, setNewSite] = useState<string>("");

  useEffect(() => {
    console.log("useEffect");
    getProxyData();
  }, []);

  const getProxyData = async () => {
    const proxyData = await sendToBackground<string, ProxyData>({
      name: "getProxyData"
    });
    console.log('proxyData', proxyData);
    setServer(proxyData.server);
    setUrlList(proxyData.siteList);
    setProxyMode(proxyData.proxyMode);
  };

  const switchProxy = async (checkMode: ProxyMode) => {
    console.log(checkMode);
    setProxyMode(checkMode);
    const resp = await sendToBackground({
      name: "switchProxyMode",
      body: checkMode
    });
    console.log("resp", resp);
  };


  const updateProxyServer = async () => {
    // console.log(server);
    const resp = await sendToBackground<ProxyData, boolean>({
      name: "updateProxyData",
      body: {
        server
      }
    });
    console.log("updateProxyServer resp", resp);
    if (resp) await getProxyData();
  };

  const addNewSite = async () => {
    const resp = await sendToBackground<string, boolean>({
      name: "addNewProxySite",
      body: newSite
    });
    console.log("addNewSite resp", resp);
    if (resp) await getProxyData();
  };

  return (
    <div className="h-55 w-96 p-2">
      <header className="flex justify-between items-center mb-2">
        <div className="flex justify-center items-center">
          <img src={logo} className="h-8 mr-1" />
          <h1 className="font-bold text-xl">MiniProxy</h1>
        </div>
        <Switch onChange={switchProxy} checkMode={proxyMode} />
      </header>
      {
        proxyMode !== "direct" && proxyMode !== "system"
        && (
          <div id="content" className="flex justify-between h-32">
            <div id="side" className=" w-[35%] h-28">
              <h2 className="font-bold text-xs mb-1">站点列表</h2>
              <div className="p-1 bg-purple-100 h-full rounded overflow-y-scroll shadow-md">
                {
                  urlList.length === 0 ? (
                    <span>数据加载中...</span>
                  ) : (
                    <ul>
                      {
                        urlList.map(item => (
                          <li key={item}>{item}</li>
                        ))
                      }
                    </ul>
                  )
                }
              </div>
            </div>
            <div className="w-[60%] flex flex-col justify-between" >
              <div className="mb-3">
                <h2 className="font-bold text-xs mb-1">代理url</h2>
                <div className="p-1 bg-purple-100 shadow-md rounded flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="mb-1">
                      <label htmlFor="ip" className='font-bold mr-1'>HOST:</label>
                      <input value={server.host} onChange={e => setServer({ ...server, host: e.target.value })} id="ip" type="text" placeholder="127.0.0.1" className='text-xs py-[0.1rem] px-[0.25rem] w-[5.5rem] mr-1 rounded-full outline-none ' />
                    </div>
                    <div>
                      <label htmlFor="port" className='font-bold mr-1'>PORT:</label>
                      <input value={server.port} onChange={e => setServer({ ...server, port: e.target.value })} id="port" type="text" placeholder="8080" className='text-xs py-[0.1rem] px-[0.25rem] w-[5.5rem] rounded-full outline-none' />
                    </div>
                  </div>
                  <ClickButton onClick={updateProxyServer}>设置</ClickButton>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-xs mb-1">站点添加</h2>
                <div className="p-1 bg-purple-100 shadow-md rounded flex justify-between items-center">
                  <div>
                    <label className='font-bold mr-1'>SITE:</label>
                    <input value={newSite} onChange={e => setNewSite(e.target.value)} type="text" placeholder="google.com" className="text-xs py-[0.1rem] px-[0.25rem] w-[7.5rem] outline-none rounded-full" />
                  </div>
                  <ClickButton onClick={addNewSite}>添加</ClickButton>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
};


interface ClickButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}
const ClickButton: FC<ClickButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="inline-block items-center px-2 py-1 transition-all border-none shadow-lg hover:shadow-md active:scale-105 bg-purple-300 hover:bg-purple-400 text-slate-600 hover:text-slate-900 rounded"
    >
      <span className="inline-flex items-center justify-center text-xs font-semibold">
        {children}
      </span>
    </button>
  );
};

interface SwitchProps {
  onChange?: (checked: ProxyMode) => void;
  checkMode?: ProxyMode;
}
const Switch: FC<SwitchProps> = ({ onChange, checkMode }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as ProxyMode;
    // 触发外部的onChange回调
    if (onChange) {
      onChange(value);
    }
  };
  let radioMapperList: { id: number, mode: ProxyMode; }[] = [{ id: 0, mode: "direct" }, { id: 1, mode: "system" }, { id: 2, mode: "manual" }];
  return (
    <div className="switch3 rounded-xl relative border-[1.2px] flex h-7 w-48">
      {radioMapperList.map((item) => (
        <div key={item.id} className="flex-1 flex rounded-xl">
          <input
            className="hidden cursor-pointer"
            type="radio"
            id={`switch3-radio${item.id + 1}`}
            name="radio"
            value={item.mode}
            checked={checkMode === item.mode}
            onChange={handleInputChange}
          />
          <label
            className={`select-none transition-all duration-1000 z-10 flex-1 rounded-xl leading-7 text-center font-bold cursor-pointer ${checkMode === item.mode
              ? `text-blue-500 ${checkMode === "direct" ? 'text-purple-500' : checkMode === "system" ? 'text-blue-500' : checkMode === "manual" ? 'text-green-500' : ''}`
              : ''
              }`}
            htmlFor={`switch3-radio${item.id + 1}`}
          >
            {item.mode.toUpperCase()}
          </label>
        </div>
      ))}
    </div>
  );
};




export default IndexPopup;