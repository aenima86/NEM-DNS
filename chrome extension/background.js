//Wait for click

//var nem = require("nem-sdk").default;




chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(null, {
    "file": "popup.js"
  }, function () {
    "popup.js";
    console.log("Script Executed ...");
  });
})


//Wait webRequest


var filter = {
  urls: ["<all_urls>"],
  types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
};
var opt_extraInfoSpec = [];



chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var fname = details.url;

    var ext = fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);

    if (ext.toLowerCase().replace("/", "") == "nem") {

      var loadingurl = 'https://aenima86.github.io/DNS_loading/';
      chrome.tabs.update({url: loadingurl});


      var nemurl = details.url.replace(/.nem/g, '').replace("http://", "").replace("https://", "").replace("www.", "").replace("/", "");

      chrome.extension.getBackgroundPage().console.log('namespace:' + nemurl);
      var PA = getPointerAccount(nemurl); //get PointerAdd
      chrome.extension.getBackgroundPage().console.log("PointerAddress:" + PA);

      tryNIS(0, nemurl, PA); // trying NIS[0]


    }




  }, filter, opt_extraInfoSpec);




//TRY NIS FUNCTION
//TRY NIS FUNCTION
function tryNIS(NISnumber, namespace, PA) {

  var NIS = ["https://shibuya.supernode.me:7891", "https://la.nemchina.com:7891", "https://public.nemchina.com:7891", "https://frankfurt.nemchina.com:7891", "https://tokyo.nemchina.com:7891", "https://london.nemchina.com:7891"];

  currNIS = NIS[NISnumber]; //lets try a NIS

  NISrequest = currNIS + "/namespace?namespace=" + namespace;

  chrome.extension.getBackgroundPage().console.log("trying:" + NISrequest);

  var jqxhr = $.getJSON(NISrequest, function () {
  })
    .done(function (data) {

      chrome.extension.getBackgroundPage().console.log("done");
      chrome.extension.getBackgroundPage().console.log("owner:" + data['owner']);
      getDNSinfo(NISnumber, namespace, PA, data['owner']);


    })
    .fail(function () {
      chrome.extension.getBackgroundPage().console.log("error");
      if (NISnumber <= NIS.length) { tryNIS(NISnumber + 1); 1 } else { alert('Could not find ' + namespace + '.nem'); }


    })
    .always(function () {
      chrome.extension.getBackgroundPage().console.log("complete");
    });
}



//GET DNS INFO FUNCTION
//GET DNS INFO FUNCTION
function getDNSinfo(NISnumber, namespace, PA, owner) {

  var NIS = ["https://shibuya.supernode.me:7891", "https://la.nemchina.com:7891", "https://public.nemchina.com:7891", "https://frankfurt.nemchina.com:7891", "https://tokyo.nemchina.com:7891", "https://london.nemchina.com:7891"];
  var nem = require("nem-sdk").default;

  

  currNIS = NIS[NISnumber]; //lets try a NIS

  NISrequest = currNIS + "/account/transfers/incoming?address=" + PA;

  chrome.extension.getBackgroundPage().console.log("trying:" + NISrequest);

  var jqxhr = $.getJSON(NISrequest, function () {
  })
    .done(function (data) {

      chrome.extension.getBackgroundPage().console.log("done");
      var stop = 0;

      $.each(data['data'], function (index, value) {


        if (nem.model.address.toAddress(value['transaction']['signer'], nem.model.network.data.mainnet.id) == owner) {


          var payload = convertFromHex(value['transaction']['message']['payload']);
          var objPayload = jQuery.parseJSON(payload);
          if (objPayload['dns'] == 'yes' && stop == 0) {

            stop = 1;
            //alert(payload);

           var urlip = objPayload['ip1'];

            // Check if protocol is set or set default
            if (urlip.search("http")< 0 && urlip.search("https:")< 0 ) urlip = 'http://' + urlip;

            chrome.tabs.update({url: urlip});
            //chrome.tabs.create({ url: urlip });

          }

        }



      });

      if (stop == 0) {

        alert('Could not find ' + namespace + '.nem');
      }


    })
    .fail(function () {
      chrome.extension.getBackgroundPage().console.log("error");
      alert('Could not find ' + namespace + '.nem');


    })
    .always(function () {
      chrome.extension.getBackgroundPage().console.log("complete");
    });
}


/**
* Calculate pointer address from namespace
*/
function getPointerAccount(namespace) {

  var nem = require("nem-sdk").default;

  var passphrase = nem.crypto.js.SHA256(namespace);
  var privateKey = nem.crypto.helpers.derivePassSha(passphrase, 1).priv;
  var keyPair = nem.crypto.keyPair.create(privateKey);
  var publicKey = keyPair.publicKey.toString();
  var address = nem.model.address.toAddress(publicKey, nem.model.network.data.mainnet.id);
  return address;

}
/**
* convert from hex
*/
function convertFromHex(hex) {
  var hex = hex.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}