$(document).ready(function() {
	// Get Mappings JSON from backgrond page and stringify it
	mappings = JSON.stringify(chrome.extension.getBackgroundPage().mappings, null, 4);
	
	// Get rid of the opening and closing braces
	mappings = mappings.substring(1, mappings.length-1);
	$('#mappings').text(mappings);
});