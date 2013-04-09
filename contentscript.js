// Notify the background script 
chrome.extension.sendRequest(mappings, function(response) { console.log("Response received.") } );