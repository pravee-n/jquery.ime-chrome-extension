var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
chrome[runtimeOrExtension].onMessage.addListener( function( request, sender, sendResponse ) {
	if ( request.fileToInject !== undefined ) {
		chrome.tabs.executeScript( null, {file: request.fileToInject}, function () {
			sendResponse( { "injected": true } );    	
		});
	}
	else {
		sendResponse( { "injected": false, "errorMessage": "No file specified" } );
	}
	return true;
});