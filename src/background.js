var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
var languageRulesPath = "libs/jquery.ime/";

chrome[runtimeOrExtension].onMessage.addListener( function( request, sender, sendResponse ) {
	if ( request.fileToInject !== undefined ) {
		chrome.tabs.executeScript( null, {file: languageRulesPath + request.fileToInject}, function () {
			sendResponse( { "injected": true } );    	
		});
	}
	else {
		sendResponse( { "injected": false, "errorMessage": "No file specified" } );
	}
	return true;
});