document.addEventListener('DOMContentLoaded', function() {

    document.getElementById("btnSave").addEventListener('click', function() {
        var btn = document.getElementById("btnSave");
        btn.textContent = "Saving...";
        btn.disabled = true;
        // chrome.storage.sync.set({"config:whatever": false});
        setTimeout(function() {
            btn.textContent = "Saved";
            btn.disabled = false;
        }, 500);
    
    }, false);
}, false);