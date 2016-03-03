document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.sync.get("bRotateNonSecureImages", function(obj) {
        document.getElementById("cbRotateImages").checked = (obj && obj.bRotateNonSecureImages);
    });

    document.getElementById("btnSave").addEventListener('click', function() {
        var btn = document.getElementById("btnSave");
        var status = document.getElementById("txtStatus");
        status.textContent = "Saving...";
        btn.disabled = true;
        var cbRotateImages = document.getElementById("cbRotateImages");
        chrome.storage.sync.set({"bRotateNonSecureImages": cbRotateImages.checked}, null);

        status.textContent = "Saved";
        btn.disabled = false;

        setTimeout(function() { status.textContent = ""; }, 750);
    }, false);
}, false);