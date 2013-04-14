$(document).ready(function() {
	// Get the mappings object from the background page
	mappings = chrome.extension.getBackgroundPage().mappings;
	
	// Format the mappings for output
	mappings = formatMappings(mappings);
	
	// Get each mapping and draw in the popup
	$(mappings).each(function(key, value) {
		$('#mappings')
			.append($("<option></option")
			.attr("value", key)
			.text(value.description));
	});
	
	// Add an onchange event to the dropdown
	$('#mappings').change(function() {
		var selected = $('#mappings option:selected').val();
		$('#mappingCfn').text(mappings[selected].cfn);
	});
	
	// Trigger the onchange event
	$('#mappings').change();
});

// Format the mappings object passed from the content script
// to a format suitable for display
function formatMappings(mappings) {
	// If mappings isn't an array, make it one (allows us to support)
	// providing multiple mapping entries when there different AMI types
	// available (i.e., ebs, s3, hvm, pv, 32, 64, etc)
	if(! $.isArray(mappings)) {
		mappings = new Array(mappings);
	}
	
	var mappingCfnOutput,
			mappingOutput = [];
	
	// Itereate each mapping entry
	$(mappings).each(function(key, mapping) {		
		// Convert list of mappings to CFN format
		mappingCfnOutput = {
			Mappings : { }
		}
	
		// Set name for mapping
		mappingCfnOutput.Mappings[mapping.name] = {};
	
		var region, ami;
	
		// Add each region->AMI item
		$(mapping.list).each(function(key, regionToAmiEntry) {
			ami = regionToAmiEntry.ami;
			region = regionToAmiEntry.region;
			mappingCfnOutput.Mappings[mapping.name][region] = { "AMI" : ami };
		});
	
		// Get Mappings JSON from backgrond page and stringify it
		var mappingCfnOutput = JSON.stringify(mappingCfnOutput, null, 4);
		var description = mapping.description;
	
		// Get rid of the opening and closing braces
		mappingCfnOutput = mappingCfnOutput.substring(1, mappingCfnOutput.length-1);
		
		mappingOutput.push( { description : mapping.description, cfn : mappingCfnOutput } );
	});
	
	return mappingOutput;
}

var mappings;