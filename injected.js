
var lnks = document.getElementsByTagName("a");
for(var i = 0; i < lnks.length; i++) {
   if (lnks[i].href.toLowerCase().indexOf("http:") == 0) {
		lnks[i].style.backgroundColor = "#cc6666";
		//lnks[i].style.backgroundColor = "rgba(ff, 0, 0, .5);";
		lnks[i].style.borderRadius = "4px";
		lnks[i].style.border = "2px solid red";    
		lnks[i].style.padding = "6px 6px 6px 6px";
		lnks[i].style.margin = "3px 3px 3px 3px";
   		lnks[i].title = lnks[i].href;
   		// document.body.style.backgroundColor="#A7E6A7";
   		
	}
}