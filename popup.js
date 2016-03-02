document.addEventListener('DOMContentLoaded', function() {

//    document.getElementById('lnkCopy').addEventListener('click', function() {}    }, false);


    chrome.tabs.query({active: true, currentWindow: true /**/ }, function(activeTabs) {
        if (activeTabs.length < 1) return; // impossible?
            /*for (var i=0; i<activeTabs.length; i++) {
            alert("Tab:\n" + JSON.stringify(activeTabs[i]) + activeTabs[i].url + activeTabs[i].title);
            // https://developer.chrome.com/extensions/tabs#type-Tab
            // https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en-US
            // https://developer.chrome.com/extension
            s/activeTab
            }*/

        var oUri = document.createElement("a");
        oUri.href = activeTabs[0].url;

        var sProt = oUri.protocol.toLowerCase();

        if (sProt.indexOf("chrome") == 0)
        {
            document.getElementById("txtStatus").textContent = "Unfortunately, Chrome's internal pages cannot be analyzed.";
            return;
        }

        // http://stackoverflow.com/questions/11613371/chrome-extension-content-script-on-https-chrome-google-com-webstore
        if (oUri.href.toLowerCase().indexOf("https://chrome.google.com/webstore/") == 0)
        {
            document.getElementById("txtStatus").textContent = "Unfortunately, Chrome's Web Store pages cannot be analyzed.";
            return;
        }

        var lnkDomain = document.getElementById("lnkDomain");
        lnkDomain.href = "https://www.ssllabs.com/ssltest/analyze.html?d=" + escape(oUri.hostname);
        lnkDomain.innerText = (((sProt == "http:") || (sProt =="ftp:")) ? (sProt.slice(0,-1)+"/") : "") + oUri.hostname;

        // https://developer.chrome.com/extensions/tabs#method-executeScript
        // https://developer.chrome.com/extensions/content_scripts#pi
        chrome.tabs.executeScript(null, {file:"injected.js", allFrames: true, runAt:"document_idle"}, function() {
            // If you try and inject into an extensions page or the webstore/NTP you'll get an error
            if (chrome.runtime.lastError) {
                // TODO: Log error in popup
                console.log('moarTLS error injecting script : \n' + chrome.runtime.lastError.message);
            }
        });

    });
}, false);

function computeDisplayString(cInsecure, cTotal)
{
    if (cTotal < 1) return "This page does not contain any links.";
    if (cInsecure < 1) {
        if (cTotal == 1) return "The only link on this page is secure.";
        if (cTotal == 2) return "Both links on this page are secure.";
        return "All " + cTotal + " links on this page are secure.";
    }
    if (cInsecure == cTotal) {
        if (cTotal == 1) return "The only link on this page is non-secure.";
        if (cTotal == 2) return "Both links on this page are non-secure.";
        return "All " + cTotal + " links on this page are non-secure.";
    }
    return (cInsecure + " of " + cTotal + " links " + ((cInsecure == 1) ? "is" : "are") + " non-secure.");
}

function checkForHTTPS(lnk)
{
    if ((lnk.title.substring(0,11) == "This URL is") || 
        (lnk.title.substring(0,11) == "[Checking] ")) return;
    lnk.title = "[Checking] Using XmlHttpRequest to check for a HTTPS version of this url...";
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load",  function() { 
            lnk.classList.add("isHTTPSyes");
            var sHSTS = oReq.getResponseHeader("Strict-Transport-Security"); lnk.textContent = lnk.textContent.substring(11); 
            lnk.title = "This URL is available at HTTPS" + ((sHSTS) ? " + HSTS!" : ""); 
            if (sHSTS) lnk.classList.add("isHSTS"); 
            }, false);
    oReq.addEventListener("error", function() { lnk.textContent = lnk.textContent.substring(11); lnk.classList.add("isHTTPSno"); lnk.title = "This URL is NOT available by simply changing the protocol to HTTPS."; }, false);
    var oUri = document.createElement("a");
    oUri.href = lnk.textContent;
    oUri.protocol = "https:";
    // TODO: Should we wipe the path to prevent cases where e.g. a HEAD example.com/logout isn't idempotent?
    // TODO: Path encoding?
    lnk.textContent = "[Checking] " + lnk.textContent;
    oReq.open("HEAD", oUri.href, true);
    oReq.send();
}


var cTotalLinks = 0;
var cTotalUnsecure = 0;

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    cTotalLinks += request.cLinks;
    cTotalUnsecure += request.unsecure.length;

    var bAnyInsecure = (cTotalUnsecure > 0);

    document.getElementById("txtStatus").innerText = computeDisplayString(cTotalUnsecure, cTotalLinks);

    document.body.style.backgroundColor = (bAnyInsecure) ? "#FEE696" : "#68FF68";
    //alert(bAnyInsecure + " " + cTotalUnsecure + " " + document.body.style.backgroundColor);

    var listUnsecure = document.getElementById("olUnsecureList");
    if (!listUnsecure)
    {
        listUnsecure = document.createElement("ol");
        listUnsecure.id = "olUnsecureList";
        document.getElementById("divUnsecureList").appendChild(listUnsecure);
    }

    for (var i=0; i < request.unsecure.length; i++) {
        var listItem = document.createElement("li");
        var text = document.createTextNode(request.unsecure[i]);
        listItem.appendChild(text);
        listItem.addEventListener('click', function(e) { 

            if (e.ctrlKey || (1 == e.button))
            {
                checkForHTTPS(this);
                return;
            }

        }, false);
        listUnsecure.appendChild(listItem);
    }
    /*alert(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");*/
   /* if (request.greeting == "hello") sendResponse({farewell: "goodbye"});*/
});

window.addEventListener('click', function(e) {
    if ((e.target.nodeName == "A") && (e.target.href !== undefined)) {
        chrome.tabs.create({ url: e.target.href });
    }
})