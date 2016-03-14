// Entire frame is insecure?
{
    let sProt = document.location.protocol.toLowerCase();
    if ((sProt === "http:") || (sProt === "ftp:")) 
    {
        document.body.classList.add("moarTLSUnsecure");
    }
}

chrome.storage.sync.get("bRotateNonSecureImages", function(obj) {
  if (obj && (false === obj.bRotateNonSecureImages)) return;
  var imgs = document.querySelectorAll("img");
  for (let i = 0; i < imgs.length; i++)
  {
    if (imgs[i].src.substring(0,5) === "http:") {
      imgs[i].classList.add("moarTLSUnsecure");
    }
  }
});

var arrUnsecure = [];
var cLinks = 0;

var forms = document.querySelectorAll("* /deep/ form[action]");
for (let i = 0; i < forms.length; i++) {
  var thisForm = forms[i];
  if (thisForm.getAttribute("action")[0] === "#") continue; // Not a cross-page 'action'
  cLinks++;
  var sUri = thisForm.action.toLowerCase();
  if (sUri.startsWith("http:"))
  {
    arrUnsecure.push(sUri);
    thisForm.title = "Form target is: " + sUri;
    thisForm.classList.add("moarTLSUnsecure");
  }
}

var lnks = document.querySelectorAll("* /deep/ a[href]");
for (let i = 0; i < lnks.length; i++) {
  var thisLink = lnks[i];
  if (thisLink.getAttribute("href")[0] === "#") continue; // Not a cross-page 'link'
  cLinks++;
  var sProtocol = thisLink.protocol.toLowerCase();
  if ((sProtocol == "http:") || (sProtocol == "ftp:")) {
    arrUnsecure.push(thisLink.href);
    thisLink.title = lnks[i].protocol + "//" + lnks[i].hostname;
    thisLink.classList.add("moarTLSUnsecure");
  }
}

chrome.runtime.sendMessage({cLinks: cLinks, unsecure: arrUnsecure }, null);
