document.addEventListener('DOMContentLoaded', function() {
  //var checkPageButton = document.getElementById('checkPage');
  //checkPageButton.addEventListener('click', function() {

    chrome.tabs.query({active: true, currentWindow: true /**/ }, function(activeTabs) {
    	if (activeTabs.length < 1) return; // impossible?
    	/*for (var i=0; i<activeTabs.length; i++)    	{
      		alert("Tab:\n" + JSON.stringify(activeTabs[i]) + activeTabs[i].url + activeTabs[i].title);
      	// https://developer.chrome.com/extensions/tabs#type-Tab
      	// https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en-US
      	// https://developer.chrome.com/extensions/activeTab
      	}*/

        var oUri = document.createElement("a");
        oUri.href = activeTabs[0].url;
        var lnkDomain = document.getElementById("lnkDomain");
        lnkDomain.href = "https://www.ssllabs.com/ssltest/analyze.html?d=" + escape(oUri.hostname);
        lnkDomain.innerText = oUri.hostname;

        var sProt = oUri.protocol.toLowerCase();
        if ((sProt == "http:") || (sProt =="ftp:"))
        {
            document.body.style.backgroundColor="#E04343";
        }


      	// https://developer.chrome.com/extensions/tabs#method-executeScript
      	// https://developer.chrome.com/extensions/content_scripts#pi
        chrome.tabs.executeScript(null, {file:"injected.js", allFrames: true, runAt:"document_idle"}, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        console.log('moarTLS error injecting script : \n' + chrome.runtime.lastError.message);
        // TODO: Log error in popup
      }
  });

    /*
      d = document;
      var f = d.createElement('form');
      f.action = 'http://gtmetrix.com/analyze.html?bm';
      f.method = 'post';
      var i = d.createElement('input');
      i.type = 'hidden'; i.name = 'url';
      i.value = tab.url;      f.appendChild(i);
      d.body.appendChild(f);
      f.submit(); */
    });
  }, false);
//}, false);

var slUnsecure = [];
var cTotalLinks = 0;


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    cTotalLinks += request.cLinks;
    slUnsecure = slUnsecure.concat(request.unsecure);

    document.getElementById("txtStatus").innerText = slUnsecure.length + " of " + cTotalLinks + " links were non-secure";

    var bAnyInsecure = (slUnsecure.length > 0);

    document.body.style.backgroundColor= (bAnyInsecure) ? "#FEE696" : "#68FF68";
//alert (JSON.stringify(request));

    document.getElementById("txtUnsecureList").innerHTML = (!bAnyInsecure) ? "&#x1f604;" :
     "<ol><li>" + slUnsecure.join("<li>") + "</ol>";   // TODO: GAPING SECURITY BUG
    /*alert(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");*/
   /* if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});*/
  });

window.addEventListener('click', function(e) {
  if ((e.target.nodeName == "A") && 
      (e.target.href !== undefined)) {
        chrome.tabs.create({
            url: e.target.href
        })
    }
})