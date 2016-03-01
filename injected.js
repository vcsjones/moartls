// Entire frame is insecure?
if ((document.location.protocol == "http:") ||
    (document.location.protocol == "ftp:")) 
{
    document.body.style.backgroundColor="#E04343";
}

    var lnks = document.getElementsByTagName("a");
    var arrUnsecure = [];
    for(var i = 0; i < lnks.length; i++) {
        var thisLink = lnks[i];
        var sProtocol = thisLink.protocol.toLowerCase();
        if ((sProtocol == "http:") || (sProtocol == "ftp:")) {
            arrUnsecure.push(thisLink.href);
            thisLink.style.backgroundColor = "#DE6A6A";
            thisLink.style.borderRadius = "4px";
            thisLink.style.border = "2px solid red";
            thisLink.style.padding = "6px 6px 6px 6px";
            thisLink.style.margin = "3px 3px 3px 3px";
            thisLink.title = lnks[i].protocol + "//" + lnks[i].hostname;
        }
    }

//https://developer.chrome.com/extensions/messaging
chrome.runtime.sendMessage({cLinks: lnks.length, unsecure: arrUnsecure },
 null //function(response) {  console.log(response.farewell);}
);