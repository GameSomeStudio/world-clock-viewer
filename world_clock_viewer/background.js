chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: "http://gamesome.fontsa.com/worldhours/" });
  }
});