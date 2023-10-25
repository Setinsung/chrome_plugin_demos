function injectScript(file_path, tag) {
  var tagElm = document.getElementsByTagName(tag)[0];
  var scriptElm = document.createElement("script");
  scriptElm.setAttribute("type", "text/javascript");
  scriptElm.setAttribute("src", file_path);
  tagElm.appendChild(scriptElm);
}
injectScript(chrome.runtime.getURL("content.js"), "body");