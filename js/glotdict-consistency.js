let gd_quicklinks_copy_state = 'true' === localStorage.getItem( 'gd_quicklinks_copy_state' );
let gd_quicklinks_window = { 'closed': true };

if ( 'undefined' !== typeof $gp ) {
	gd_quicklinks();
	gd_consistency();
}

function gd_quicklinks() {
	const gd_quicklinks_output = gd_create_element( 'span', { 'class': 'gd_quicklinks' } );
	const gd_quicklinks_copy = gd_create_element(
		'button',
		{
			'type': 'button',
			'class': `gd_quicklinks_copy with-tooltip ${( gd_quicklinks_copy_state ) ? 'active' : 'inactive'}`,
			'aria-label': 'Click this and another to copy',
		}
	);
	gd_quicklinks_copy.append(
		gd_create_element( 'span', { 'class': 'screen-reader-text' }, 'Copy toggle' ),
		gd_create_element( 'span', { 'class': 'dashicons dashicons-clipboard', 'aria-hidden': 'true' } )
	);
	const gd_quicklinks_separator = gd_create_element(
		'span',
		{
			'class': `gd_quicklinks_plus dashicons ${( gd_quicklinks_copy_state ) ? 'dashicons-plus' : 'separator'}`,
			'aria-hidden': 'true',
		}
	);
	const gd_quicklinks_permalink = gd_create_element( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_permalink with-tooltip', 'aria-label': 'Permalink to translation' } );
	gd_quicklinks_permalink.append(
		gd_create_element( 'span', { 'class': 'screen-reader-text' }, 'Permalink to translation' ),
		gd_create_element( 'span', { 'class': 'dashicons dashicons-admin-links', 'aria-hidden': 'true' } )
	);

	const gd_quicklinks_history = gd_create_element( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_history with-tooltip', 'aria-label': 'Translation History' } );
	gd_quicklinks_history.append(
		gd_create_element( 'span', { 'class': 'screen-reader-text' }, 'Translation History' ),
		gd_create_element( 'span', { 'class': 'dashicons dashicons-backup', 'aria-hidden': 'true' } )
	);

	const gd_quicklinks_consistency = gd_create_element( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_consistency with-tooltip', 'aria-label': 'View original in consistency tool' } );
	gd_quicklinks_consistency.append(
		gd_create_element( 'span', { 'class': 'screen-reader-text' }, 'View original in consistency tool' ),
		gd_create_element( 'span', { 'class': 'dashicons dashicons-list-view', 'aria-hidden': 'true' } )
	);

	gd_quicklinks_output.append(
		gd_quicklinks_copy,
		gd_quicklinks_separator,
		gd_quicklinks_permalink,
		gd_quicklinks_history,
		gd_quicklinks_consistency
	);

	gd_add_elements( '.editor-panel__right .panel-header', 'beforeend', gd_quicklinks_output );

	document.querySelectorAll( '.editor' ).forEach( ( editor ) => {
		const editor_menu = editor.querySelectorAll( '.button-menu__dropdown li a' );
		editor.querySelector( '.gd_quicklinks_permalink' ).dataset.quicklink = editor_menu[ 0 ].href;
		editor_menu[ 1 ].href += '&historypage';
		editor.querySelector( '.gd_quicklinks_history' ).dataset.quicklink = editor_menu[ 1 ].href;
		editor.querySelector( '.gd_quicklinks_consistency' ).dataset.quicklink = `${editor_menu[ 2 ].href}&consistencypage`;
	} );

	gd_add_evt_listener( 'click', '.gd_quicklinks_copy, .gd_quicklinks_plus', gd_toggle_quicklinks_copy );
	gd_add_evt_listener( 'click', '.gd_quicklinks_item', gd_do_quicklinks );
}

function gd_do_quicklinks( event ) {
	if ( gd_quicklinks_copy_state ) {
		const btn_target = event.currentTarget;
		const current_aria_label = btn_target.getAttribute( 'aria-label' );
		gd_copy_to_clipboard( event.currentTarget.dataset.quicklink );
		btn_target.setAttribute( 'aria-label', 'Copied!' );
		setTimeout( () => { btn_target.setAttribute( 'aria-label', current_aria_label ); }, 2000 );
	} else {
		if ( ! gd_quicklinks_window.closed ) {
			gd_quicklinks_window.close();
		}
		gd_quicklinks_window = window.open( event.currentTarget.dataset.quicklink, '_blank' );
	}
}

function gd_toggle_quicklinks_copy() {
	document.querySelectorAll( '.gd_quicklinks_plus' ).forEach( ( el ) => {
		el.classList.toggle( 'dashicons-plus' );
		el.classList.toggle( 'separator' );
	} );
	document.querySelectorAll( '.gd_quicklinks_copy' ).forEach( ( el ) => {
		el.classList.toggle( 'active' );
		el.classList.toggle( 'inactive' );
	} );
	gd_quicklinks_copy_state = ! gd_quicklinks_copy_state;
	localStorage.setItem( 'gd_quicklinks_copy_state', gd_quicklinks_copy_state );
}

function gd_consistency() {
	const gd_consistency_output = gd_create_element( 'details', { 'class': 'gd_consistency suggestions__translation-consistency', 'open': 'open' } );
	const gd_consistency_summary = gd_create_element( 'summary', { }, 'Suggestions from Consistency' );
	const gd_consistency_button = gd_create_element( 'button', { 'class': 'gd_get_consistency' }, 'View Consistency suggestions' );
	gd_consistency_output.append( gd_consistency_summary, gd_consistency_button );

	gd_add_elements( '.editor-panel__left .suggestions-wrapper', 'beforeend', gd_consistency_output );
	gd_add_evt_listener( 'click', '.gd_get_consistency', gd_show_consistency );
}

function gd_show_consistency( event ) {
	event.target.textContent = 'Loading...';
	const consistency_url = event.target.closest( '.editor-panel' ).querySelectorAll( '.button-menu__dropdown li a' )[ 2 ].href;

	fetch( consistency_url )
		.then( consistency_response => consistency_response.text() )
		.then( consistency_response => {
			const consistency_parser = new DOMParser();
			const consistency_page = consistency_parser.parseFromString( consistency_response, 'text/html' );
			const consistency_translations = consistency_page.querySelectorAll( '.consistency-table tbody th strong' );
			let translations_count, unique_translation_count;

			if ( 1 === consistency_translations.length ) {
				unique_translation_count = consistency_page.querySelectorAll( 'tr' ).length - 2;
				unique_translation_count = ` (${unique_translation_count} time${( unique_translation_count > 1 ) ? 's' : ''})`;
			} else {
				translations_count = consistency_page.querySelectorAll( '.translations-unique small' );
			}

			let gd_consistency_suggestions;

			if ( consistency_translations.length ) {
				let gd_consistency_item,
					gd_consistency_item_div,
					gd_consistency_item_translation,
					gd_consistency_item_index,
					gd_consistency_item_count,
					gd_consistency_item_raw,
					gd_consistency_item_button;

				gd_consistency_suggestions = gd_create_element( 'ul', { class: 'suggestions-list' } );

				for ( let i = 0; i < consistency_translations.length; i++ ) {
					gd_consistency_item = document.createElement( 'li' );
					gd_consistency_item_div = gd_create_element( 'div', { 'class': 'translation-suggestion with-tooltip', 'role': 'button', 'aria-pressed': 'false', 'aria-label': 'Copy translation', 'tabindex': '0' } );
					gd_consistency_item_translation = gd_create_element( 'span', { 'class': 'translation-suggestion__translation' }, consistency_translations[ i ].textContent );
					gd_consistency_item_index = gd_create_element( 'span', { 'class': 'translation-suggestion__translation index' }, `${i + 1}: ` );
					gd_consistency_item_count = gd_create_element( 'span', { 'class': 'consistency-count' }, ( 1 === consistency_translations.length ) ? unique_translation_count : translations_count[ i ].textContent );
					gd_consistency_item_raw = gd_create_element( 'span', { 'class': 'translation-suggestion__translation-raw', 'aria-hidden': 'true' }, consistency_translations[ i ].textContent );
					gd_consistency_item_button = gd_create_element( 'button', { 'type': 'button', 'class': 'copy-suggestion' }, 'Copy' );
					gd_consistency_item_translation.prepend( gd_consistency_item_index );
					gd_consistency_item_translation.append( gd_consistency_item_count );
					gd_consistency_item_div.append( gd_consistency_item_translation, gd_consistency_item_raw, gd_consistency_item_button );
					gd_consistency_item.append( gd_consistency_item_div );
					gd_consistency_suggestions.append( gd_consistency_item );
				}
			} else {
				gd_consistency_suggestions = 'No suggestions.';
			}
			event.target.before( gd_consistency_suggestions );
			event.target.parentNode.removeChild( event.target );
		} )
		.catch( error => console.log( error ) );
}
