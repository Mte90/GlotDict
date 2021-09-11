let gd_details = {};

chrome.runtime.onInstalled.addListener( ( details ) => {
	// 'install', 'update', 'chrome_update', or 'shared_module_update'
	gd_details = details;
	gd_details[ 'currentVersion' ] = chrome.runtime.getManifest().version;
} );

chrome.runtime.onMessage.addListener( ( request, sender, sendResponse ) => {
	if ( 'gd-status' === request ) {
		sendResponse( gd_details );
	}
} );
