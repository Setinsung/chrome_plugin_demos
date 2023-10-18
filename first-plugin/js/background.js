chrome.runtime.onInstalled.addListener(() => {
  console.log("插件已被安装");
});

// 监听消息
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  console.log(msg, sender);
  // 响应回调
  response({
    id: 'msg'
  });
});

// 添加菜单项
var menuItemId = chrome.contextMenus.create({
  type: 'normal',
  title: '点击我1',
  id: 'mymenuid',
  contexts: ['all']
}, function () {
  console.log('contextMenus created');
});

var menuItemId2 = chrome.contextMenus.create({
  type: 'checkbox', // 类型， normal checkbox radio
  title: '点击我2',
  id: 'mymenuid2', // 唯一id
  contexts: ['all']
}, function () {
  console.log('contextMenus2 created');
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == 'mymenuid') {
    console.log('点击了菜单1');
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.memuItemId == 'mymenuid') {
    // 请求
    const response = fetch('http://127.0.0.1/test', {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8;"
      },
      body: "username=wtf&age=114"
    }).then(function (res) {
      console.log(res);
    });
    // 操作storage
    chrome.storage.sync.set({ color: 'blue' }, function () {
      console.log("保存成功");
    });
  }
  if (info.memuItemId == 'mymenuid2') {
    chrome.storage.sync.get({ color: '' }, function (item) {
      console.log(item);
    });
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == 'mymenuid') {
    chrome.tabs.query({}, function (tabs) {
      console.log(tabs);
    });
    // 新建tab
    chrome.tabs.create({ url: 'https://www.jd.com', active: true });
    // 获取当前tab
    async function getCurrentTab() {
      let queryoptions = { active: true, lastFocusedwindow: true };
      // tab'will either be a tabs.Tab'instance or undefined'.
      let [tab] = await chrome.tabs.query(queryoptions);
      return tab;
    }
    getCurrentTab().then(function (tab) {
      console.log(tab);
    });

    //删除tab
    //chrome.tabs.remove(tabId);
    //更新tab
    chrome.tabs.update(tabId, { url: 'https://www.taobao.com' });
  }
});


