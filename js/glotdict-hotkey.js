/**
 * Add the hotkeys in GlotPress
 *
 * @returns void
 */
function gd_hotkeys() {
	jQuery( $gp.editor.table ).off( 'keydown', 'tr.editor textarea', $gp.editor.hooks.keydown );
	key.filter = function( event ) {
		const tagName = ( event.target || event.srcElement ).tagName;
		key.setScope( /^(SELECT)$/.test( tagName ) ? 'input' : 'other' );
		return true;
	};
	key( 'ctrl+shift+enter', () => {
		if ( jQuery( '.editor:visible' ).length > 0 ) {
			jQuery( '.editor:visible .discard-glotdict' ).trigger( 'click' );
			jQuery( '.editor:visible .discard-warning' ).trigger( 'click' );
			jQuery( '.editor:visible .translation-actions button.translation-actions__save' ).addClass( 'forcesubmit' ).trigger( 'click' );
		} else {
			alert( 'No opened string to add!' );
		}
		return false;
	} );
	key( 'ctrl+enter', () => {
		if ( jQuery( '.editor:visible' ).length > 0 ) {
			jQuery( '.editor:visible .translation-actions button.translation-actions__save' ).trigger( 'click' );
		} else {
			alert( 'No opened string to add!' );
		}
		return false;
	} );
	key( 'ctrl+shift+z', () => {
		if ( jQuery( '.editor:visible' ).length > 0 ) {
			jQuery( '.editor:visible .panel-header-actions .panel-header-actions__cancel' ).trigger( 'click' );
		}
		return false;
	} );
	key( 'ctrl+shift+a', () => {
		if ( jQuery( '.editor:visible .translation-actions button.translation-actions__save' ).length > 0 ) {
			jQuery( '.editor:visible .translation-actions button.translation-actions__save' ).trigger( 'click' );
		} else {
			alert( 'No opened string to approve!' );
		}
		return false;
	} );
	key( 'ctrl+shift+b', () => {
		if ( jQuery( '.editor:visible .textareas' ).length > 1 ) {
			jQuery( '.editor:visible .translation-form-list button' ).each( ( index, item ) => {
				jQuery( item ).trigger( 'click' );
				jQuery( '.editor:visible .translation-actions__copy' ).trigger( 'click' );
			} );
		} else {
			if ( jQuery( '.editor:visible .translation-actions__copy' ).length > 0 ) {
				jQuery( '.editor:visible .translation-actions__copy' ).trigger( 'click' );
			}
		}
		return false;
	} );
	key( 'ctrl+shift+f', () => {
		if ( jQuery( '.editor:visible .fuzzy' ).length > 0 ) {
			jQuery( '.editor:visible .fuzzy' ).trigger( 'click' );
		}
		return false;
	} );
	key( 'ctrl+shift+r', () => {
		if ( jQuery( '.editor:visible .meta button.reject' ).length > 0 ) {
			jQuery( '.editor:visible .meta button.reject' ).trigger( 'click' );
		} else {
			alert( 'No opened string to reject!' );
		}
		return false;
	} );
	key( 'ctrl+shift+x', () => {
		jQuery( 'textarea.foreign-text:visible:first' ).val( ( index, text ) => {
			// Replace space-colon or nbsp-colon with just colon, then replace colons with nbsp-colon
			let s = text.replace( /( :|&nbsp;:)/g, ':' ).replace( /:/g, '&nbsp;:' );
			// Fix http and https from the above replace
			s = s.replace( /http&nbsp;:/g, 'http:' ).replace( /https&nbsp;:/g, 'https:' );
			// Replace space-question or nbsp-question with just question, then replace question with nbsp-question
			s = s.replace( /( \?|&nbsp;\?)/g, '?' ).replace( /\?/g, '&nbsp;?' );
			// Replace space-exclamation or nbsp-exclamation with just exclamation, then replace exclamation with nbsp-exclamation
			s = s.replace( /( !|&nbsp;!)/g, '!' ).replace( /!/g, '&nbsp;!' );
			// Replace space-%-space with nbsp-%-space
			s = s.replace( /( % )/g, '&nbsp;% ' );
			// Replace space-dot-space or space-dot with just dot-space, same for comma
			s = s.replace( /( \. | \.)/g, '. ' ).replace( /( , | ,)/g, ', ' );
			// Replace space-closebracket-space or space-closebracket with just closebracket-space, same for squarebracket
			s = s.replace( /( \) | \))/g, ') ' ).replace( /( ] | ])/g, '] ' );
			// Replace space-openbracket-space or openbracket-space with just space-openbracket, same for squarebracket
			s = s.replace( /( \( |\( )/g, ' (' ).replace( /( \[ |\[ )/g, ' [' );
			return s;
		} );
		return false;
	} );
	key( 'ctrl+d', () => {
		jQuery( '.editor:visible .discard-glotdict' ).trigger( 'click' );
		jQuery( '.editor:visible .discard-warning' ).trigger( 'click' );
		return false;
	} );
	key( 'ctrl+shift+d', () => {
		jQuery( '.discard-glotdict' ).trigger( 'click' );
		jQuery( '.discard-warning' ).trigger( 'click' );
		return false;
	} );
	key( 'pageup', () => {
		$gp.editor.prev();
		return false;
	} );
	key( 'pagedown', () => {
		$gp.editor.next();
		return false;
	} );
	key( 'alt+c', () => {
		document.querySelectorAll( '.gd-consistency' ).forEach( ( el ) => { gd_do_consistency( el ); } );
		return false;
	} );
}
