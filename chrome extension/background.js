//Wait for click


chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {
  	"file": "popup.js"
  }, function(){ 
  	"popup.js";
  	console.log("Script Executed ...");
  });
})


var filter = {urls: ["<all_urls>"],
types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
};
var opt_extraInfoSpec = [];

var host = "https://rawgit.com/aenima86/NEM-DNS/master/index.html?url=";
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var fname = details.url;
    var ext = fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);
    if(ext.toLowerCase().replace("/", "")=="nem") {
        var nemurl = details.url.replace("http://", "").replace("www.", "").replace("/", "");
        chrome.extension.getBackgroundPage().console.log( nemurl );
        chrome.tabs.update({url: host+nemurl+'&b=find.stop'});
        //chrome.tabs.create({ url: host+nemurl });
 
     
  
    }



    
}, filter, opt_extraInfoSpec);
