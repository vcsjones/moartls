"use strict";

document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.sync.get(null, function(prefs) 
    {
        document.getElementById("cbRotateImages").checked = !(prefs && (false === prefs["bRotateNonSecureImages"]));
        document.getElementById("cbWarnOnNonSecureDownloads").checked = (prefs && (true === prefs["bWarnOnNonSecureDownloads"]));
    });

    var checkboxes = document.querySelectorAll("input[type=checkbox]");
    for (let i=0; i<checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', saveChanges, false);
    }

}, false);

function saveChanges() {
    const status = document.getElementById("txtStatus");
    status.textContent = "Saving...";
    const cbRotateImages = document.getElementById("cbRotateImages");
    const cbWarnOnNonSecureDownloads = document.getElementById("cbWarnOnNonSecureDownloads");
    chrome.storage.sync.set({"bRotateNonSecureImages": cbRotateImages.checked, 
                             "bWarnOnNonSecureDownloads": cbWarnOnNonSecureDownloads.checked}, null);

    status.textContent = "Saved";

    setTimeout(function() { status.innerHTML = "&nbsp;"; }, 450);
}

//    document.getElementById("btnSave").addEventListener('click', function() {
