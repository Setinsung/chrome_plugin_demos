import type { ReactNode, MouseEventHandler, FC } from 'react';
import "~style.css";
import logo from "data-base64:~assets/icon.png";

interface ClickButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}
const ClickButton: FC<ClickButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="inline-block items-center px-2 py-1 transition-all border-none shadow-lg hover:shadow-md active:scale-105 bg-blue-100 hover:bg-blue-200 text-slate-600 hover:text-slate-900 rounded"
    >
      <span className="inline-flex items-center justify-center text-xs font-semibold">
        {children}
      </span>
    </button>
  );
};

function IndexPopup() {
  return (
    <div className="h-55 w-96 p-2">
      <header className="flex justify-between items-center mb-2">
        <div className="flex justify-center items-center">
          <img src={logo} className="h-8 mr-1" />
          <h1 className="font-bold text-xl">MiniProxy</h1>
        </div>
        <ClickButton>你好</ClickButton>
      </header>
      <div id="content" className="flex justify-between h-32">
        <div id="side" className=" w-3/12 h-28">
          <h2 className="font-bold text-xs mb-1">站点列表</h2>
          <div className="p-1 bg-slate-100 h-full rounded">
            数据加载中...
          </div>
        </div>
        <div className="w-[70%] flex flex-col justify-between" >
          <div className="mb-3">
            <h2 className="font-bold text-xs mb-1">代理url</h2>
            <div className="p-1 bg-slate-100 rounded flex justify-between items-center">
              <div>
                <label htmlFor="ip" className='font-bold mr-1'>HOST:</label>
                <input id="ip" type="text" placeholder="127.0.0.1" className='text-xs py-[0.1rem] px-[0.25rem] w-[5.5rem] mr-1 rounded-full outline-none ' />
                <label htmlFor="port" className='font-bold mr-1'>PORT:</label>
                <input id="port" type="text" placeholder="8080" className='text-xs py-[0.1rem] px-[0.25rem] w-[2.2rem] rounded-full outline-none' />
              </div>
              <ClickButton>确定</ClickButton>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-xs mb-1">站点添加</h2>
            <div className="p-1 bg-slate-100 rounded flex justify-between items-center">
              <div>
                <label className='font-bold mr-1'>SITE:</label>
                <input type="text" placeholder="google.com" className="text-xs py-[0.1rem] px-[0.25rem] w-[10.8rem] outline-none rounded-full" />
              </div>
              <ClickButton>确定</ClickButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndexPopup;