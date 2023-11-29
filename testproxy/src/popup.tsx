import { type ReactNode, type MouseEventHandler, type FC, useState, useRef } from 'react';
import "~style.css";
import logo from "data-base64:~assets/icon.png";
import { sendToBackground } from "@plasmohq/messaging";

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
  onChange?: (checked: boolean) => void;
  checked?: boolean;
}
const Switch: FC<SwitchProps> = ({ onChange, checked }) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };
  return (
    <>
      <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
        <input
          type='checkbox'
          name='autoSaver'
          className='sr-only'
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`slider shadow-lg  hover:shadow-md flex h-[19.5px] w-[37.5px] items-center rounded-full p-[0.18rem] duration-200 ${isChecked ? 'bg-purple-500 hover:bg-purple-400' : 'bg-purple-100 hover:bg-purple-200'
            }`}
        >
          <span
            className={`dot h-[13.5px] w-[13.5px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-[1.12rem]' : ''
              }`}
          />
        </span>
      </label>
    </>
  );
};






const IndexPopup = () => {
  const switchProxy = async (checked: boolean) => {
    console.log(checked);
    const resp = await sendToBackground({
      name: "ping",
      body: {
        id: 123
      }
    });

    console.log(resp);
  };
  return (
    <div className="h-55 w-96 p-2">
      <header className="flex justify-between items-center mb-2">
        <div className="flex justify-center items-center">
          <img src={logo} className="h-8 mr-1" />
          <h1 className="font-bold text-xl">MiniProxy</h1>
        </div>
        <Switch onChange={switchProxy} />
      </header>
      <div id="content" className="flex justify-between h-32">
        <div id="side" className=" w-[26%] h-28">
          <h2 className="font-bold text-xs mb-1">站点列表</h2>
          <div className="p-1 bg-purple-100 h-full rounded overflow-y-scroll shadow-md">
            数据加载中...
          </div>
        </div>
        <div className="w-[70%] flex flex-col justify-between" >
          <div className="mb-3">
            <h2 className="font-bold text-xs mb-1">代理url</h2>
            <div className="p-1 bg-purple-100 shadow-md rounded flex justify-between items-center">
              <div>
                <label htmlFor="ip" className='font-bold mr-1'>HOST:</label>
                <input id="ip" type="text" placeholder="127.0.0.1" className='text-xs py-[0.1rem] px-[0.25rem] w-[5.5rem] mr-1 rounded-full outline-none ' />
                <label htmlFor="port" className='font-bold mr-1'>PORT:</label>
                <input id="port" type="text" placeholder="8080" className='text-xs py-[0.1rem] px-[0.25rem] w-[2.2rem] rounded-full outline-none' />
              </div>
              <ClickButton>设置</ClickButton>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-xs mb-1">站点添加</h2>
            <div className="p-1 bg-purple-100 shadow-md rounded flex justify-between items-center">
              <div>
                <label className='font-bold mr-1'>SITE:</label>
                <input type="text" placeholder="google.com" className="text-xs py-[0.1rem] px-[0.25rem] w-[10.8rem] outline-none rounded-full" />
              </div>
              <ClickButton>添加</ClickButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPopup;