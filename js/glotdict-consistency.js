let gd_quicklinks_copy_state = 'true' === localStorage.getItem( 'gd_quicklinks_copy_state' );
let gd_quicklinks_window = { 'closed': true };

if ( typeof $gp_editor_options !== 'undefined' ) {
	gd_quicklinks();
	gd_consistency();
	gd_notranslate();
}

function gd_quicklinks( current_editor = '.editor' ) {
	const gd_quicklinks_output = gd_create_element( 'span', { 'class': 'gd_quicklinks' } );
	const gd_quicklinks_copy = gd_create_element(
		'button',
		{
			'type':       'button',
			'class':      `gd_quicklinks_copy with-tooltip ${( gd_quicklinks_copy_state ) ? 'active' : 'inactive'}`,
			'aria-label': 'Click this and another to copy',
		},
	);
	gd_quicklinks_copy.append(
		gd_create_element( 'span', { 'class': 'screen-reader-text' }, 'Copy toggle' ),
		gd_create_element( 'span', { 'class': 'dashicons dashicons-clipboard', 'aria-hidden': 'true' } ),
	);
	const gd_quicklinks_separator = gd_create_element(
		'span',
		{
			'class':       `gd_quicklinks_plus dashicons ${( gd_quicklinks_copy_state ) ? 'dashicons-plus' : 'separator'}`,
			'aria-hidden': 'true',
		},
	);
	const gd_quicklinks_permalink = gd_create_element( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_permalink with-tooltip', 'aria-label': 'Permalink to translation' } );
	gd_quicklinks_permalink.append(
		gd_create_element( 'span', { 'class': 'screen-reader-text' }, 'Permalink to translation' ),
		gd_create_element( 'span', { 'class': 'dashicons dashicons-admin-links', 'aria-hidden': 'true' } ),
	);

	const gd_quicklinks_history = gd_create_element( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_history with-tooltip', 'aria-label': 'Translation History' } );
	gd_quicklinks_history.append(
		gd_create_element( 'span', { 'class': 'screen-reader-text' }, 'Translation History' ),
		gd_create_element( 'span', { 'class': 'dashicons dashicons-backup', 'aria-hidden': 'true' } ),
	);

	const gd_quicklinks_consistency = gd_create_element( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_consistency with-tooltip', 'aria-label': 'View original in consistency tool' } );
	gd_quicklinks_consistency.append(
		gd_create_element( 'span', { 'class': 'screen-reader-text' }, 'View original in consistency tool' ),
		gd_create_element( 'span', { 'class': 'dashicons dashicons-list-view', 'aria-hidden': 'true' } ),
	);

	gd_quicklinks_output.append(
		gd_quicklinks_copy,
		gd_quicklinks_separator,
		gd_quicklinks_permalink,
		gd_quicklinks_history,
		gd_quicklinks_consistency,
	);

	gd_add_elements( `${current_editor} .editor-panel__right .panel-header`, 'beforeend', gd_quicklinks_output );

	document.querySelectorAll( `${current_editor}` ).forEach( ( editor ) => {
		const editor_menu = editor.querySelectorAll( '.button-menu__dropdown li a' );
		editor.querySelector( '.gd_quicklinks_permalink' ).dataset.quicklink = editor_menu[ 0 ].href;
		editor_menu[ 1 ].href += '&historypage';
		editor.querySelector( '.gd_quicklinks_history' ).dataset.quicklink = editor_menu[ 1 ].href;
		editor.querySelector( '.gd_quicklinks_consistency' ).dataset.quicklink = `${editor_menu[ 2 ].href}&consistencypage`;
	} );

	gd_add_evt_listener( 'click', `${current_editor} .gd_quicklinks_copy, ${current_editor} .gd_quicklinks_plus`, gd_toggle_quicklinks_copy );
	gd_add_evt_listener( 'click', `${current_editor} .gd_quicklinks_item`, gd_do_quicklinks );
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

function gd_consistency( current_editor = '.editor' ) {
	if ( document.querySelector( '.gd-get-consistency' ) !== null ) {
		return;
	}
	const gd_consistency_output = gd_create_element( 'details', { 'class': 'gd-consistency suggestions__translation-consistency', 'open': 'open' } );
	const gd_consistency_summary = gd_create_element( 'summary', { }, 'Suggestions from Consistency' );
	const gd_consistency_loading = document.querySelector( '.suggestions__loading-indicator' );

	gd_consistency_output.append( gd_consistency_summary );
	gd_consistency_loading && gd_consistency_output.append( gd_consistency_loading );
	gd_add_elements( `${current_editor} .editor-panel__left .suggestions-wrapper .suggestions__translation-memory`, 'afterEnd', gd_consistency_output );

	// If the current table has only one editor, already opened, load suggestions for it.
	( $gp.editor.current ) && gd_do_consistency( $gp.editor.current[ 0 ].querySelector( '.gd-consistency' ) );
}

async function gd_do_consistency( el ) {
	if ( ! el || el.classList.contains( 'initialized' ) ) {
		return;
	}
	el.classList.add( 'initialized' );
	const consistency_url = el.closest( '.editor-panel' ).querySelectorAll( '.button-menu__dropdown li a' )[ 2 ].href.replace( 'consistency?search', 'consistency/?search' );
	const consistency_page = await gd_consistency_get_page( consistency_url );
	if ( false === consistency_page ) {
		gd_consistency_end( el, 'Error loading suggestions. Try refreshing.' );
		return;
	}

	const consistency_alternatives = consistency_page.querySelectorAll( '.consistency-table tbody tr th strong' );

	if ( ! consistency_alternatives.length ) {
		gd_consistency_end( el, 'No suggestions.' );
		return;
	}

	const current_string = {
		'translated_texts':   [],
		'form_names':         [],
		'alternatives_count': gd_consistency_get_alternative_count( consistency_page, consistency_alternatives.length ),
	};

	const this_panel_content = el.closest( '.panel-content' );
	this_panel_content.querySelectorAll( 'textarea' ).forEach( ( translation_form ) => {
		current_string.translated_texts[ current_string.translated_texts.length ] = translation_form.value;
	} );

	const translation_forms = this_panel_content.querySelectorAll( '.translation-form-list .translation-form-list__tab' );
	translation_forms.forEach( ( form ) => {
		current_string.form_names[ current_string.form_names.length ] = form.textContent.trim();
	} );

	const gd_consistency_suggestions = gd_create_element( 'ul', { class: 'gd-suggestions-list' } );
	const arrow = document.createElement( 'span' );
	arrow.title = 'This is the current translation used for this string.';
	arrow.className = 'gd-arrow';
	arrow.textContent = ' ⟵';

	for ( let consistency_alternatives_i = 0; consistency_alternatives_i < consistency_alternatives.length; consistency_alternatives_i++ ) {
		const alternative = {
			'forms_text': [ consistency_alternatives[ consistency_alternatives_i ].textContent ],
			'i':          consistency_alternatives_i,
			'arrow':      arrow,
		};
		if ( translation_forms.length > 1 ) {
			const string_page = await gd_consistency_get_page( consistency_alternatives[ consistency_alternatives_i ].parentNode.parentNode.nextSibling.querySelectorAll( 'td .meta a' )[ 1 ].href.replace( '?filters', '/?filters' ) );
			const consistency_textareas = string_page.querySelectorAll( '.translation-wrapper .textareas textarea' );

			consistency_textareas.forEach( ( textarea, i ) => {
				alternative.forms_text[ i ] = textarea.value;
			} );

			const gd_consistency_item_header = gd_create_element( 'li', { 'class': 'consistency-header-index' }, `#${consistency_alternatives_i + 1}` );
			gd_consistency_item_header.append(
				gd_create_element( 'button', { 'type': 'button', 'class': 'copy-full-alternative', 'data-alternative_id': consistency_alternatives_i }, 'Copy' ),
				gd_create_element( 'span', { 'class': 'consistency-count' }, current_string.alternatives_count[ consistency_alternatives_i ] ),
			);
			gd_consistency_suggestions.append( gd_consistency_item_header );
			gd_consistency_suggestions.classList.add( 'with-plural' );
		}
		gd_consistency_suggestions.append( gd_consistency_add_alternative( alternative, current_string ) );
	}
	if ( '1' === $gp_editor_options.can_approve && consistency_alternatives.length > 1 ) {
		const warning = document.createElement( 'div' );
		warning.className = 'gte-warning';
		warning.textContent = `${consistency_alternatives.length} current different translations!`;
		gd_consistency_suggestions.insertAdjacentElement( 'afterBegin', warning );
	}

	el.append( gd_consistency_suggestions );
	( translation_forms.length > 1 ) &&	gd_consistency_format_for_plural( this_panel_content );
	gd_consistency_end( el );
}

async function gd_consistency_get_page( url ) {
	try {
		const res = await fetch( url, { headers: new Headers( { 'User-agent': 'Mozilla/4.0 Custom User Agent' } ) } );
		const txt = await res.text();
		const consistency_parser = new DOMParser();
		return consistency_parser.parseFromString( txt, 'text/html' );
	} catch ( error ) {
		return false;
	}
}

function gd_consistency_get_alternative_count( consistency_page, consistency_count ) {
	if ( 1 === consistency_count ) {
		const unique_alternative_count = consistency_page.querySelectorAll( 'tr' ).length - 2;
		return [ ` (${unique_alternative_count} time${( unique_alternative_count > 1 ) ? 's' : ''})` ];
	}
	const alternatives_count = [];
	consistency_page.querySelectorAll( '.translations-unique small' ).forEach( ( el ) => {
		alternatives_count[ alternatives_count.length ] = el.textContent;
	} );
	return alternatives_count;
}

function gd_consistency_add_alternative ( alternative, current_string ) {
	const space_span = gd_create_element( 'span', { 'class': 'space' }, ' ' );
	const consistency_alternative_fragment = document.createDocumentFragment();
	alternative.forms_text.forEach( ( form_text, form_text_i ) => {
		const is_this_one = ( form_text === current_string.translated_texts[ form_text_i ] ) ? alternative.arrow.cloneNode( true ) : '';
		const gd_consistency_item = document.createElement( 'li' );
		const gd_consistency_item_div = gd_create_element( 'div', { 'class': 'translation-suggestion with-tooltip', 'role': 'button', 'aria-pressed': 'false', 'aria-label': 'Copy translation', 'tabindex': '0' } );
		const gd_consistency_item_translation = gd_create_element( 'span', { 'class': 'translation-suggestion__translation' } );
		const alternative_as_words_fragment = document.createDocumentFragment();
		const alternative_as_words = form_text.split( ' ' );
		alternative_as_words.forEach( ( word, word_i ) => {
			alternative_as_words_fragment.appendChild( document.createTextNode( word ) );
			( word_i < alternative_as_words.length - 1 ) && alternative_as_words_fragment.append( space_span.cloneNode( true ) );
		} );
		gd_consistency_item_translation.append( alternative_as_words_fragment, is_this_one );
		const meta_info = ( current_string.form_names.length ) ? `${current_string.form_names[ form_text_i ]}: ` : `${alternative.i + 1}: `;
		const gd_consistency_item_meta = gd_create_element( 'span', { 'class': 'translation-suggestion__translation index' }, meta_info );
		const gd_consistency_item_raw = gd_create_element( 'span', { 'class': `translation-suggestion__translation-raw consistency_alternative__${alternative.i}_${form_text_i}`, 'aria-hidden': 'true' }, form_text );
		const gd_consistency_item_button = gd_create_element( 'button', { 'type': 'button', 'class': 'copy-suggestion' }, 'Copy' );
		gd_consistency_item_translation.prepend( gd_consistency_item_meta );
		( 0 === current_string.form_names.length ) && gd_consistency_item_translation.append( gd_create_element( 'span', { 'class': 'consistency-count' }, current_string.alternatives_count[ alternative.i ] ) );
		gd_consistency_item_div.append( gd_consistency_item_translation, gd_consistency_item_raw, gd_consistency_item_button );
		gd_consistency_item.append( gd_consistency_item_div );
		consistency_alternative_fragment.appendChild( gd_consistency_item );
	} );
	return consistency_alternative_fragment;
}

function gd_consistency_format_for_plural( this_panel_content ) {
	gd_add_evt_listener( 'click', '.copy-full-alternative', gd_consistency_copy_full_alternative );
	this_panel_content.querySelectorAll( '.gd-consistency .copy-suggestion' ).forEach( ( el ) => {
		el.parentNode.removeChild( el );
	} );
	this_panel_content.querySelectorAll( '.gd-consistency .translation-suggestion' ).forEach( ( el ) => {
		el.classList.remove( 'translation-suggestion' );
	} );
	this_panel_content.querySelectorAll( '.gd-consistency .with-tooltip' ).forEach( ( el ) => {
		el.classList.remove( 'with-tooltip' );
	} );
}

function gd_consistency_copy_full_alternative( event ) {
	const panel_content = event.target.closest( '.panel-content' );
	const alternative_id = event.currentTarget.dataset.alternative_id;
	panel_content.querySelectorAll( 'textarea' ).forEach( ( textarea, i ) => {
		const suggestion_form = panel_content.querySelector( `.consistency_alternative__${alternative_id}_${i}` );
		if ( suggestion_form ) {
			textarea.value = suggestion_form.textContent;
		}
	} );
	panel_content.querySelector( ' .textareas.active textarea' ).focus();
}

function gd_consistency_end( el, error = false ) {
	error && el.append( error );
	const loading = el.querySelector( '.suggestions__loading-indicator' );
	loading && el.removeChild( loading );
}

function gd_notranslate( current_editor = '.editor' ) {
	const notranslate_header = document.createElement( 'div' );
	notranslate_header.textContent = 'Non-translatable';
	notranslate_header.append( gd_create_element( 'button', { 'type': 'button', 'class': 'gd_notranslate_copy_all' }, 'Copy all' ) );
	document.querySelectorAll( `${current_editor.replace( 'editor', 'preview' )} .original` ).forEach( ( original_preview ) => {
		const editor = original_preview.parentNode.nextElementSibling;
		const notranslate = gd_create_element( 'div', { 'class': 'gd_notranslate' } );
		const notranslate_fragment = document.createDocumentFragment();
		const original_preview_forms = original_preview.querySelectorAll( '.original-text' );

		// Workaround. See https://gist.github.com/vlad-timotei/9fc62e9c1b7a40d4708a3b0345ad2a22
		( original_preview_forms.length > 1 ) && editor.querySelectorAll( '.source-string.strings div .original' ).forEach( ( original_editor_form, form_i ) => {
			original_editor_form.textContent = '';
			original_editor_form.append( original_preview_forms[ form_i ].cloneNode( true ) );
		} );

		let has_notranslate = false;
		original_preview_forms[ 0 ].parentNode.querySelectorAll( '.original-text > .notranslate' ).forEach( ( item ) => {
			const notranslate_item = document.createElement( 'a' );
			notranslate_item.setAttribute( 'title', 'Click to insert this item to textarea!' );
			notranslate_item.textContent = item.textContent;
			notranslate_fragment.appendChild( notranslate_item );
			has_notranslate = true;
		} );

		if ( has_notranslate ) {
			notranslate.prepend( notranslate_header.cloneNode( true ) );
			notranslate.append( notranslate_fragment );
			// To do: Replace with user object to check if is logged in.
			const suggestion_wrapper_el = editor.querySelector( '.suggestions-wrapper' );
			( suggestion_wrapper_el ) && suggestion_wrapper_el.prepend( notranslate );
		}
	} );
	document.querySelectorAll( '.editor .notranslate' ).forEach( ( el ) => { el.setAttribute( 'title', 'Click to insert this item to textarea!' ); } );
	gd_notranslate_events( current_editor );
}

function gd_notranslate_events( current_editor ) {
	gd_add_evt_listener( 'click', `${current_editor} .translation-form-list li button`, ( ev ) => {
		const textareas = ev.currentTarget.closest( '.translation-wrapper' ).querySelectorAll( '.textareas' )[ ev.currentTarget.dataset.pluralIndex ];
		textareas.classList.add( 'active' );
		textareas.querySelector( 'textarea' ).focus();
	} );
	gd_add_evt_listener( 'focus', `${current_editor} textarea`, gd_notranslate_update );
	gd_add_evt_listener( 'keyup', `${current_editor} textarea`, gd_notranslate_update );
	gd_add_evt_listener( 'click', `${current_editor} .gd_notranslate a, ${current_editor} .notranslate`, ( ev ) => {
		gd_notranslate_insertText( ev.currentTarget.closest( '.editor-panel__left' ).querySelector( '.textareas.active textarea' ), ev.currentTarget.textContent );
	} );
	gd_add_evt_listener( 'click', `${current_editor} .gd_notranslate_copy_all`, ( ev ) => {
		let all_notranslate = '';
		const notranslate_div = ev.currentTarget.parentNode.parentNode;
		notranslate_div.querySelectorAll( 'a' ).forEach( ( el ) => {
			all_notranslate += `${el.textContent} `;
		} );
		gd_notranslate_insertText( notranslate_div.closest( '.editor-panel__left' ).querySelector( '.textareas.active textarea' ), all_notranslate );
	} );
	const unique_editor = document.querySelector( '.editor[style*="display: table-row;"] textarea' );
	if ( unique_editor ) {
		unique_editor.blur();
		unique_editor.focus();
	}
}

function gd_notranslate_insertText( el, text ) {
	const selection = { start: el.selectionStart, end: el.selectionEnd };
	const new_position = selection.start + text.length;
	el.value = el.value.slice( 0, selection.start ) + text + el.value.slice( selection.end );
	el.focus();
	el.setSelectionRange( new_position, new_position );
}

function gd_notranslate_update( ev ) {
	let textarea_content = ev.currentTarget.value;
	ev.currentTarget.closest( '.editor-panel__left' ).querySelectorAll( '.gd_notranslate a' ).forEach( ( notranslate_item ) => {
		const notranslate_text = notranslate_item.textContent;
		if ( textarea_content.indexOf( notranslate_text ) > -1 ) {
			notranslate_item.classList.add( 'used' );
			textarea_content = textarea_content.replace( notranslate_text, '' );
			return;
		}
		notranslate_item.classList.remove( 'used' );
	} );
}
