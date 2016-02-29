document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  //checkPageButton.addEventListener('click', function() {

    chrome.tabs.query({active: true, currentWindow: true /**/ }, function(activeTabs) {
    	if (activeTabs.length < 1) return; // impossible?
    	
    	/*for (var i=0; i<activeTabs.length; i++)
    	{
      		alert("Tab:\n" + JSON.stringify(activeTabs[i]) + activeTabs[i].url + activeTabs[i].title);
      	// https://developer.chrome.com/extensions/tabs#type-Tab
      	// https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en-US
      	// https://developer.chrome.com/extensions/activeTab
  
      	}*/
      	
      	// https://developer.chrome.com/extensions/tabs#method-executeScript
      	// https://developer.chrome.com/extensions/content_scripts#pi
      	chrome.tabs.executeScript(null, {file:"injected.js", runAt:"document_idle"}, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
  		  if (chrome.runtime.lastError) {
    			  alert('There was an error injecting script : \n' + chrome.runtime.lastError.message);
    		}
  });
      	
    /*
      d = document;

      var f = d.createElement('form');
      f.action = 'http://gtmetrix.com/analyze.html?bm';
      f.method = 'post';
      var i = d.createElement('input');
      i.type = 'hidden';
      i.name = 'url';
      i.value = tab.url;
      f.appendChild(i);
      d.body.appendChild(f);
      f.submit(); */
    });
  }, false);
//}, false);


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    document.getElementById("txtStatus").innerText = request.unsecure.length + " of " + request.cLinks + " links were non-secure";

    var bAnyInsecure = request.unsecure.length > 0;
    if (!bAnyInsecure)
    {
        document.body.style.backgroundColor="#68FF68";
    }

    if ((sender.tab.url.toLowerCase().indexOf("http:") == 0) ||
        (sender.tab.url.toLowerCase().indexOf("ftp:") == 0))
    {
        document.body.style.backgroundColor="#E04343";
    }

    document.getElementById("txtUnsecureList").innerHTML = (!bAnyInsecure) ? "&#x1f604;" :
     "<ol><li>"+request.unsecure.join("<li>") + "</ol>";   // TODO: GAPING SECURITY BUG
    /*alert(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");*/
   /* if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});*/
  });
  
  
  
  