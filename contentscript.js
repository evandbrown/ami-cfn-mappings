// This script is executed when a user visits an http(s)://aws.amazon.com/amis/* URL

// Build an object of region->AMI mappings that's compatible
// with the CloudFormation mapping structure
function getMappings() {
	//Stub out a Mappings object
	mappings = 
	{
		"Mappings" : {
			"AWSRegion2AMI" : {

			}
		}
	};

	// Build regular expressions to extract region
	// and AMI parameters from URL
	regionRegex = /\?region=(.*)#/;
	amiRegex = /launchAmi=(ami-[a-h0-9]+)/;

	// Get each item from the 'Launch AMI' dropdown
	$('.ami_launch_dropdown li a').each(function() {
		// Get and parse HREF for region and AMI ID
		href = $(this).attr('href');
		region = regionRegex.exec(href)[1];
		ami = { "AMI" : amiRegex.exec(href)[1] };

		// Append a mapping for this AMI and Region
		mappings.Mappings.RegionMap[region] = ami;	
	});
	
	return mappings;
}
// Notify the background script and pass the mappings object
chrome.extension.sendRequest(getMappings(), function(response) {} );