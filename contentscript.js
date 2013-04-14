/**
  * This content script will be executed in the DOM context
  * of the URLs defined in the manifest. Bsaed on the URL, the
  * script determines which jQuery-powered screen-scraping
  * algorithm to use to generate an mappings object, then
  * fires an event that is received by background.js, which
  * makes the mappings object available to the popup.
  **/

// Build a mappings object given a name, description,
// and array of region->ami items
function getMappingsObject(mappingName, mappingDesc, regionToAmiList) {
	var mappings = {
		description : mappingDesc,
		list : regionToAmiList,
		name : mappingName
	}
	
	return mappings;
}

// Build an object of region->AMI mappings that's compatible
// with the CloudFormation mapping structure
function getMappingsFromAmisPage() {
	// List for holding region->ami pairs
	var regionToAmi = [];

	var desc, href;
	
	// Get each item from the 'Launch AMI' dropdown
	$('.ami_launch_dropdown li a').each(function() {
		// Get and parse HREF for region and AMI ID
		href = $(this).attr('href');
		desc = $('.title').text();
		
		// Append a mapping for this AMI and Region
		regionToAmi.push( { region : getRegionFromHref(href), ami : getAmiIdFromHref(href) } );
	});
	
	return getMappingsObject("AWSRegionToAMI", desc, regionToAmi);
}

// Build an object of region->AMI mappings from the
// Amazon Linux landing page
function getMappingsFromALinuxLandingPage() {
	//Stub out a Mappings object and other vars
	var mappings = [],
			regionToAmi = [],
			name = "AWSRegionToAMI",
			href,
			desc,
			offset,
			amiTd;

	// Locate the AMI table
	var amiTable = $('h1:contains("Amazon Linux AMI IDs")').next();

	// Get each column, which indicates Storage/Arch/VirtType of an AMI. 
	// Each column will correspond to an AMI
	$(amiTable).find('tbody > tr:first > td').each(function(col, td) {
		// Rest the array of region->ami items
		regionToAmi = [];
		
		// Ignore the first col
		if(0 != col) { 
			desc = $(td).text();
			
			// Iterate through each row for for this column
			$(amiTable).find('tbody > tr').each(function(row, tr) {
				// Ignore the first row
				if(0 != row) {
					offset = col + 1;
					amiTd = $(tr).find('td:nth-child('+offset+')');
					if($(amiTd).children().size() > 0) {
						href = $(amiTd).children('a').attr('href');
						
						// Append a mapping for this AMI and Region
						regionToAmi.push( { region : getRegionFromHref(href), ami : getAmiIdFromHref(href) } );
					}
				}
			});
			
			// Add mapping for this AMI to collection
			mappings.push(getMappingsObject(name, desc, regionToAmi));
		}
	});
	
	return mappings;
}

// Return the region code (e.g., us-east-1) from the href
// of a link on aws.amazon.com
function getRegionFromHref(href) {
	var regionRegex = /\?region=(.*)#/;
	return regionRegex.exec(href)[1];
}

// Return the AMI ID from the href of a link on aws.amazon.com
function getAmiIdFromHref(href) {
	amiRegex = /launchAmi=(ami-[a-h0-9]+)/;
	return amiRegex.exec(href)[1];
}

// GLOBALS
var mappings;

// Use a different parsing mechanism depending on the page we're on:
// http(s)://aws.amazon.com/amazon-linux-ami
if(/^https?:\/\/aws.amazon.com\/amazon-linux-ami\/?$/.exec(document.location.href) != null) {
	mappings = getMappingsFromALinuxLandingPage();
} else { // http(s)://aws.amazon.com/amis/*
	mappings = getMappingsFromAmisPage();
}

chrome.extension.sendRequest(mappings, function(response) {} );