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

// Build an object of region->AMI mappings from the
// Amazon Linux landing page
function getMappingsFromALinuxLandingPage() {
	//console.log('getMappingsFromALinuxLandingPage');

	//Stub out a Mappings object and other vars
	var mappings = [],
			regionToAmi = [],
			name = "AWSRegionToAMI",
			href,
			desc,
			offset,
			amiTd;

	// Locate the AMI table
	var amiTable = $('div.aws-table').children().first();
	//console.log('getMappingsFromALinuxLandingPage : amiTable');
	//console.log('table content : ' + amiTable.text());

	// Get each column, which indicates Storage/Arch/VirtType of an AMI.
	// Each column will correspond to an AMI
	$(amiTable).find('tbody > tr:first > th').each(function(col, td) {
		// Rest the array of region->ami items
		regionToAmi = [];

		//console.log('col'); console.log(col);
		//console.log('td '); console.log(td);

		// Ignore the first col and the last one (marketplace)
		if(0 != col && 5 != col) {
			desc = $(td).text();
			//console.log('text'); console.log(desc);

			// Iterate through each row for for this column
			$(amiTable).find('tbody > tr').each(function(row, tr) {

				//console.log('row'); console.log(row);
				//console.log('tr '); console.log(tr);

				// Ignore the first row
				if(0 != row) {

					offset = col + 1;
					amiTd = $(tr).find('td:nth-child('+offset+')');

					//if($(amiTd).children().size() > 0) {
						//href = $(amiTd).children('a').attr('href');

						console.log(row);
						console.log(amiTd);
						// Append a mapping for this AMI and Region
						regionToAmi.push( { region : getRegionForRow(row), ami : getAmiIdFromElement(amiTd) } );
					//}

				}
			});

			// Add mapping for this AMI to collection
			mappings.push(getMappingsObject(name, desc, regionToAmi));
		}
	});

	return mappings;
}

// Return the region code (e.g., us-east-1) from the index in the table
function getRegionForRow(row) {

	REGIONS = [ 'us-east-1', 'us-west-2', 'us-west-1', 'eu-west-1', 'eu-central-1',
	'ap-southeast-1', 'ap-northeast-1', 'ap-southeast-2', 'sa-east-1', 'cn-north-1'];

	//TODO : check bounds
	return REGIONS[row-1];
}

// Return the AMI ID from the content of the HTML Table
function getAmiIdFromElement(element) {
	return element.text();
}

// GLOBALS
var mappings;
mappings = getMappingsFromALinuxLandingPage();
chrome.extension.sendRequest(mappings, function(response) {} );
