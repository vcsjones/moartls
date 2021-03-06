"use strict";
!function() {
    const arrUnsecure = [];
    let cLinks = 0;

    try
    {
        {
            let sSelector = "* /deep/ form[action]";
            if (typeof browser !== 'undefined') sSelector = "form[action]";
            const forms = document.querySelectorAll(sSelector);
            for (let i = 0; i < forms.length; i++) {
              const thisForm = forms[i];

              if (thisForm.getAttribute("action")[0] === "#") continue; // Not a cross-page 'action'
              cLinks++;

              let act = thisForm.action;
              if (!act) continue;

              // Some sites name an input element "action" which hides
              // the property of that name.
              if (!(typeof act === "string")) {
                act = thisForm.getAttribute("action");
                // Try constructing a plausible URL
                if (act[0] === "/") act = (document.location.protocol + "//" + document.location.host + act);
              }

              const sUri = act.toLowerCase();
              if (sUri.startsWith("http:"))
              {
                arrUnsecure.push(sUri);
              }
            }
        }

        {
            let sSelector = "* /deep/ a[href]";
            if (typeof browser !== 'undefined') sSelector = "a[href]";
            const lnks = document.querySelectorAll(sSelector);
            for (let i = 0; i < lnks.length; i++) {
              const thisLink = lnks[i];
              if (thisLink.getAttribute("href")[0] === "#") continue; // Not a cross-page 'link'
              cLinks++;
              const sProtocol = thisLink.protocol.toLowerCase();
              if ((sProtocol == "http:") || (sProtocol == "ftp:")) {
                arrUnsecure.push(thisLink.href);
              }
            }
        }

        // We always need to send a report or else popup.js
        // can't know when analysis is complete.
        const obj = {cLinks: cLinks, unsecure: arrUnsecure, sUrl: document.location.href };
        chrome.runtime.sendMessage(obj, null);
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request === "elements") {
            sendResponse(obj);
        }
    });
    }
    catch (e)
    {
        const obj = { "error": e.message, "context": "injectedScript" };
        console.log(obj); 
        chrome.runtime.sendMessage(obj, null);
    }
}();