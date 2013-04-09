// Executed when a request is passed from a contentscript, which
// will pass a mappings object to this background script
function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.
  chrome.pageAction.show(sender.tab.id);

	// Set the mappings object to the value passed from the contentscript
	mappings = request;

  // Return an empty object
  sendResponse({});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

// Initialize an empty mappings object. This object
// will be retrieved by the popup
mappings = {};