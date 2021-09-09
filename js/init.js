const jsScripts = [ 'jquery.bind-first', 'dompurify', 'keymaster', 'glotdict-locales', 'glotdict-functions', 'glotdict-settings', 'glotdict-hotkey', 'glotdict-validation', 'glotdict-column', 'glotdict-meta', 'glotdict-bulk', 'glotdict-notices', 'glotdict-consistency', 'glotdict' ];

script( jsScripts );

function script( url ) {
	if ( Array.isArray( url ) ) {
		const self = this,
			prom = [];
		url.forEach( ( item ) => {
			prom.push( self.script( item ) );
		} );
		return Promise.all( prom );
	}
	return new Promise( ( resolve, reject ) => {
		let r = false;
		const t = document.getElementsByTagName( 'script' )[0];
		const s = document.createElement( 'script' );
		s.type = 'text/javascript';
		s.src = chrome.runtime.getURL( `js/${url}.js` );
		s.async = false;
		s.onload = s.onreadystatechange = function() {
			if ( ! r && ( ! this.readyState || 'complete' === this.readyState ) ) {
				r = true;
				resolve( this );
			}
		};
		s.onerror = s.onabort = reject;
		t.parentNode.insertBefore( s, t );
	} );
}
// Add the icon
const t = document.getElementsByTagName( 'header' )[0];
const s = document.createElement( 'img' );
s.src = chrome.runtime.getURL( 'icons/icon-16.png' );
s.style.display = 'none';
s.classList.add( 'gd_icon' );
t.parentNode.insertBefore( s, t );
// Get extension data
chrome.runtime.sendMessage(
	'gd-status',
	( response ) => {
		( 'undefined' !== response ) && localStorage.setItem( 'gd_extension_status', JSON.stringify( response ) );
	}
);