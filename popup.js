function getMappings(action, callback){
    chrome.extension.sendRequest(
            {
                req: "getmappings",
                act: action
            },
                function(response)
                {
                    callback(response.reply);
                }
    );
}

getMappings({}, function(reply)) {
	console.log('got reply from getMappings');
}