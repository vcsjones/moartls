// Entire page is insecure?
if ((document.location.protocol == "http:") ||
    (document.location.protocol == "ftp:")) 
{
    document.body.style.backgroundColor="#E04343";
}

function iterateBody(doc, iNestDepth)
{
    iNestDepth++;
    var lnks = doc.getElementsByTagName("a");
    var arrUnsecure = [];
    for(var i = 0; i < lnks.length; i++) {
        if (lnks[i].href.toLowerCase().indexOf("http:") == 0) {
            arrUnsecure.push(lnks[i].href);
    		lnks[i].style.backgroundColor = "#cc6666";
    		//lnks[i].style.backgroundColor = "rgba(ff, 0, 0, .5);";
    		lnks[i].style.borderRadius = "4px";
    		lnks[i].style.border = "2px solid red";
    		lnks[i].style.padding = "6px 6px 6px 6px";
    		lnks[i].style.margin = "3px 3px 3px 3px";
       		lnks[i].title = "http://" + lnks[i].hostname;
       		
    	}
    }

    /* TODO: hook this up when I figure out how
    if (iNestDepth < 4)
    {
        for(var j = 0; j < window.frames.length; j++)
        {
            iterateBody(doc.frames[j].document, iNestDepth);
        }
    }*/
}

iterateBody(document, 0);

//https://developer.chrome.com/extensions/messaging
chrome.runtime.sendMessage({cLinks: lnks.length, unsecure: arrUnsecure },
 null //function(response) {  console.log(response.farewell);}
);