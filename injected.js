// Entire frame is insecure?
var sProt = document.location.protocol.toLowerCase();
if ((sProt === "http:") || (sProt === "ftp:")) 
{
    document.body.style.backgroundColor="#E04343";
}

chrome.storage.sync.get("bRotateNonSecureImages", function(obj) {
    if (obj && (false === obj.bRotateNonSecureImages)) return;
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++)
    {
        if (imgs[i].src.substring(0,5) === "http:") {
            imgs[i].style.transform="rotate(180deg)";
        }
    }
});

var arrUnsecure = [];
var cLinks = 0;

var forms = document.querySelectorAll("form[action]");
for (var i = 0; i < forms.length; i++) {
  var thisForm = forms[i];
  if (thisForm.getAttribute("action")[0] === "#") continue; // Not a cross-page 'action'
  cLinks++;
  var sUri = thisForm.action.toLowerCase();
  if (sUri.startsWith("http:"))
  {
    arrUnsecure.push(sUri);
    thisForm.style.backgroundColor = "rgba(222, 106, 106, 0.6)";
    thisForm.style.borderRadius = "4px";
    thisForm.style.border = "2px dashed red";
    thisForm.style.padding = "6px 6px 6px 6px";
    thisForm.style.margin = "3px 3px 3px 3px";
    thisForm.title = "Form target is: " + sUri;
  }
}

var lnks = document.querySelectorAll("a[href]");

for (var i = 0; i < lnks.length; i++) {
  var thisLink = lnks[i];
  if (thisLink.getAttribute("href")[0] === "#") continue; // Not a cross-page 'link'
  cLinks++;
  var sProtocol = thisLink.protocol.toLowerCase();
  if ((sProtocol == "http:") || (sProtocol == "ftp:")) {
    arrUnsecure.push(thisLink.href);
    thisLink.style.backgroundColor = "rgba(222, 106, 106, 0.6)";
    thisLink.style.borderRadius = "4px";
    thisLink.style.border = "2px groove red";
    thisLink.style.padding = "6px 6px 6px 6px";
    thisLink.style.margin = "3px 3px 3px 3px";
    thisLink.title = lnks[i].protocol + "//" + lnks[i].hostname;
  }
}

//https://developer.chrome.com/extensions/messaging
chrome.runtime.sendMessage({cLinks: cLinks, unsecure: arrUnsecure }, null);
