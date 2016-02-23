document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.query({active: true,/* currentWindow: true*/ }, function(activeTabs) {
    	if (activeTabs.length < 1) return; // impossible?
    	
    	for (var i=0; i<activeTabs.length; i++)
    	{
      		alert("Tab:\n" + JSON.stringify(activeTabs[i]) + activeTabs[i].url + activeTabs[i].title);
      	// https://developer.chrome.com/extensions/tabs#type-Tab
      	// https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en-US
      	// https://developer.chrome.com/extensions/activeTab
      	}
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
}, false);