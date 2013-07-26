var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
var imeLanguageRulesPath = 'libs/jquery.ime/';

chrome[runtimeOrExtension].onMessage.addListener( function ( request, sender, sendResponse ) {
	if ( request.fileToInject !== undefined ) {
		chrome.tabs.executeScript( null, { file: imeLanguageRulesPath + request.fileToInject }, function () {
			sendResponse( { 'injected': true } );
		} );
	}
	else {
		sendResponse( { 'injected': false, 'errorMessage': 'No file specified' } );
	}
	return true;
});