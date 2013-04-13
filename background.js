/**
  * This background script allows the extension to receive notifications
  * when the content script is executed on the relevant AMI pages. The
  * content page will publish a message to the event listener defined
  * in this background script. The message will be stored in a global
  * variable ('mappings') that can be accessed by the popup script and
  * used to draw the mappings.
  **/ 

// Event handler
function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.
  chrome.pageAction.show(sender.tab.id);

	// Set the mappings object to the value passed from the contentscript
	mappings = request;

  // Return an empty object
  sendResponse({});
};

// Register event handler
chrome.extension.onRequest.addListener(onRequest);

// Initialize an empty mappings object. This object
// will be retrieved by the popup
mappings = {};