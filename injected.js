"use strict";

var arrUnsecure = [];
var cLinks = 0;

{
    // Entire frame is insecure?
    let sProt = document.location.protocol.toLowerCase();
    if ((document.body) && 
        ((sProt === "http:") || (sProt === "ftp:"))) {
          document.body.classList.add("moarTLSUnsecure");
    }
}

{
    if (chrome.storage)
    {
        chrome.storage.sync.get("bRotateNonSecureImages", function(obj) {
          if (obj && (false === obj.bRotateNonSecureImages)) return;
          let imgs = document.querySelectorAll("img");
          for (let i = 0; i < imgs.length; i++)
          {
            if (imgs[i].src.substring(0,5) === "http:") {
              imgs[i].classList.add("moarTLSUnsecure");
            }
          }
        });
    }
}

{
    let sSelector = "* /deep/ form[action]";
    if (typeof browser !== 'undefined') sSelector = "form[action]";
    let forms = document.querySelectorAll(sSelector);
    for (let i = 0; i < forms.length; i++) {
      let thisForm = forms[i];
      if (thisForm.getAttribute("action")[0] === "#") continue; // Not a cross-page 'action'
      cLinks++;
      let sUri = thisForm.action.toLowerCase();
      if (sUri.startsWith("http:"))
      {
        arrUnsecure.push(sUri);
        thisForm.title = "Form target is: " + sUri;
        thisForm.classList.add("moarTLSUnsecure");
      }
    }
}

{
    let sSelector = "* /deep/ a[href]";
    if (typeof browser !== 'undefined') sSelector = "a[href]";
    let lnks = document.querySelectorAll(sSelector);
    for (let i = 0; i < lnks.length; i++) {
      let thisLink = lnks[i];
      if (thisLink.getAttribute("href")[0] === "#") continue; // Not a cross-page 'link'
      cLinks++;
      let sProtocol = thisLink.protocol.toLowerCase();
      if ((sProtocol == "http:") || (sProtocol == "ftp:")) {
        arrUnsecure.push(thisLink.href);
        thisLink.title = lnks[i].protocol + "//" + lnks[i].hostname;
        thisLink.classList.add("moarTLSUnsecure");
      }
    }
}

// We always need to send a report or else popup.js
// can't know when analysis is complete.
var obj = {cLinks: cLinks, unsecure: arrUnsecure };
chrome.runtime.sendMessage(obj, null);
