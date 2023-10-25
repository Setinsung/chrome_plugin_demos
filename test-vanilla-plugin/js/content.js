console.log("这里是content");
var su = document.getElementById('hotsearch-refresh-btn');
su.addEventListener("click", function () {
  alert("点击一次");
  // 发送消息，参数一消息对象
  chrome.runtime.sendMessage({ 'id': 'click' }, function (msg) {
    // 回调中接收消息接收方的响应消息对象
    console.log("收到响应", msg);
  });
});