/**
 * Saniitize the value striping html
 * @param {string} value
 * @returns {string} sanitized
 */
function sanitize_value( value ) {
	if ( 'function' === typeof value.replace ) {
		return value.replace( /<![\s\S]*?--[ \t\n\r]*>/gi, '' );
	}
	return value;
}

/**
 * Get the today with the format dd/mm/yyyy used for the update daily check
 *
 * @returns String
 */
function gd_today() {
	const today = new Date();
	let todayn = today.getDate();
	if ( 1 === todayn.length ) {
		todayn = `0${todayn}`;
	}
	let monthn = today.getMonth() + 1;
	if ( 1 === monthn.length ) {
		monthn = `0${monthn}`;
	}
	return `${todayn}/${monthn}/${today.getFullYear()}`;
}

/**
 * Get the the list of locales cached
 *
 * @returns Array
 */
function gd_list_locales_cached() {
	let value = localStorage.getItem( 'gd_locales' );
	if ( '' === value || 'undefined' === value ) {
		value = gd_locales();
	} else {
		value = JSON.parse( value );
	}
	if ( 'string' === typeof value ) {
		value = JSON.parse( value );
	}
	return value;
}

/**
 * Get the list of locales avalaible
 *
 * @returns Array
 */
function gd_locales() {
	window.glotdict_locales = [ 'ast', 'bel', 'bg_BG', 'cy', 'da_DK', 'de_DE', 'en_AU', 'en_CA', 'en_GB', 'es_ES', 'fi', 'fr_FR', 'he_IL', 'hi_IN', 'hr_HR', 'it_IT', 'ja', 'lt_LT', 'lv_LV', 'nl_BE', 'nl_NL', 'pt_BR', 'ro_RO', 'sv_SE', 'th', 'tr_TR', 'uk' ];
	const locales_date_cache = localStorage.getItem( 'gd_locales_date' );
	if ( null === locales_date_cache || locales_date_cache !== gd_today() ) {
		jQuery.ajax( {
			url:      `https://codeat.co/glotdict/dictionaries/${glotdict_version}.json`,
			dataType: 'text',
			cache:    false,
		} ).done( ( data ) => {
			localStorage.setItem( 'gd_locales', data );
			window.glotdict_locales = JSON.parse( data );
			localStorage.setItem( 'gd_locales_date', gd_today() );
		} );
	}
	if ( locales_date_cache !== null ) {
		let temp_value = JSON.parse( localStorage.getItem( 'gd_locales' ) );
		if ( 'string' === typeof temp_value ) {
			temp_value = JSON.parse( temp_value );
		}
		window.glotdict_locales = Object.keys( temp_value );
	}
	return window.glotdict_locales;
}

/**
 * Get the language saved in GlotDict
 *
 * @returns string
 */
function gd_get_lang() {
	if ( 'undefined' === typeof window.glotdict_lang ) {
		const lang = localStorage.getItem( 'gd_language' );
		if ( '' === lang || null === lang ) {
			return '';
		}
		window.glotdict_lang = sanitize_value( lang );
	}
	return window.glotdict_lang;
}

/**
 * Add links for Translation global status and Language projects archive
 * @returns void
 */
function gd_add_project_links() {
	if ( jQuery( '.gp-content .breadcrumb li' ).length > 3 && jQuery( '.gp-content .breadcrumb li:last-child a' ).length > 0 ) {
		let lang = jQuery( '.gp-content .breadcrumb li:last-child a' ).attr( 'href' ).split( '/' );
		lang = sanitize_value( lang[lang.length - 3] );
		jQuery( '.gp-content' ).prepend( `<a style="float:right" href="https://translate.wordpress.org/locale/${lang}/default" target="_blank" rel="noreferrer noopener">${jQuery( '.gp-content .breadcrumb li:last-child a' ).text()} Projects to Translate</a>` );
		jQuery( jQuery( '.gp-content h2' )[0] ).prepend( '<a class="glossary-link" style="float:right;padding-left:5px;margin-left:5px;border-left: 1px solid black;" href="https://translate.wordpress.org/stats" target="_blank" rel="noreferrer noopener">Translation Global Status</a>' );
	}
}

/**
 * Add links to glossary words
 *
 * @param {object} glossary_word node
 * @returns void
 */
function gd_add_glossary_links( glossary_word ) {
	const word = jQuery( glossary_word );
	if ( glossary_word.closest( 'tr.preview' ) ) {
		glossary_word.closest( 'tr.preview' ).classList.add( 'has-glotdict' );
	}
	word.wrap( `<a href="https://translate.wordpress.org/consistency?search=${word.text()}&amp;set=${gd_get_lang_consistency()}%2Fdefault" target="_blank" rel="noreferrer noopener"></a>` );
}

/**
 * Add the review button
 * @returns void
 */
function gd_add_review_button() {
	if ( jQuery( 'body.logged-in' ).length !== 0 ) {
		jQuery( '.filter-toolbar' ).after( '<input class="button gd-review" value="Review" type="button">' );
	}
}

/**
 * Get locale from slug or slug from locale
 *
 * @param {string} value locale or slug
 * @param {string} type the type of value 'locale' or 'slug'
 * @returns {string} slug or locale depending on type
 */
function gd_get_locale_slug( value, type ) {
	if ( 'locale' === type ) {
		return gd_locales_slugs[value] || '';
	}
	for ( const elem in gd_locales_slugs ) {
		if ( Object.prototype.hasOwnProperty.call( gd_locales_slugs, elem ) && gd_locales_slugs[elem] === value ) {
			return elem;
		}
	}
	return '';
}

/**
 * Add the buttons to scroll to the row of the language choosen
 * @returns void
 */
function gd_add_scroll_buttons() {
	const locations = {
		statsRegex:    'https:\\/\\/translate.wordpress.org\\/stats\\/$',
		projectsRegex: 'https:\\/\\/translate.wordpress.org\\/projects\\/[^\\/]+\\/[^\\/]+\\/$',
		appsRegex:     'https:\\/\\/translate.wordpress.org\\/projects\\/apps\\/[^\\/]+\\/[^\\/]+\\/$',
	}

	const slug = gd_get_locale_slug( gd_get_lang(), 'locale' );
	const lang = gd_get_lang();

	for ( const regex in locations ) {
		const position = document.querySelector( 'table' );
		const acquired = ( RegExp( locations[regex] ) ).test( window.location.href );

		if ( position && acquired ) {
			if ( '' === lang ) {
				jQuery( position ).before( '<span style="float:right;margin-bottom:1em">You didn\'t set any locale yet. <a href="https://translate.wordpress.org/projects/wp/dev/en-gb/default/#gd-language-picker">Click here</a> to set it.</span>' );
				return;
			}
			jQuery( position ).before( `<button style="float:right;margin-bottom:1em" class="gd_scroll">Scroll to ${lang}</button>` );
			const StatsSpecificLinks = Array.prototype.slice.call( document.querySelectorAll( '.stats-table tbody tr th a' ) ).filter( ( el ) => {
				return gd_get_lang() === el.textContent.trim()
			} )[0];
			jQuery( '.gd_scroll' ).on( 'click', () => {
				const target = StatsSpecificLinks || document.querySelector( `table tr th a[href*="/${slug}/"]` ) || document.querySelector( `table td strong a[href*="/${slug}/"]` );
				if ( ! target ) { return; }
				const row = target.closest( 'tr' );
				if ( ! row ) { return; }
				row.style.border = '2px solid black';
				target.style.color = '#a70505';
				if ( ! target.textContent.includes( '➤' ) ) {
					target.textContent = `➤ ${target.textContent}`;
				}
				jQuery( 'html, body' ).animate( {
					scrollTop: jQuery( row ).offset().top - 70,
				} );
			} );
		}
	}
}

/**
 * Print the locales selector
 *
 * @returns void
 */
function gd_locales_selector() {
	const lang = gd_get_lang();
	window.gd_filter_bar.append( '<span class="separator">•</span><label for="gd-language-picker">Pick locale: </label><select id="gd-language-picker" class="glotdict_language"></select>' );
	jQuery( '.glotdict_language' ).append( jQuery( '<option></option>' ) );
	const gd_locales_array = gd_locales();
	jQuery.each( gd_locales_array, ( key, value ) => {
		const new_option = jQuery( '<option></option>' ).attr( 'value', value ).text( value );
		if ( lang === value ) {
			new_option.attr( 'selected', true );
		}
		jQuery( '.glotdict_language' ).append( new_option );
	} );
	if ( '' === lang || false === lang ) {
		window.gd_filter_bar.append( '<h3 style="background-color:#ddd;padding:4px;width:130px;display:inline;margin-left:4px;color:red;">&larr; Set the glossary!</h3>' )
			.append( '<br><h2 style="background-color:#fff;padding:0;display:block;text-align:center;margin-top: 6px;">Welcome to GlotDict! Discover the features and the hotkeys on the <a href="https://github.com/Mte90/GlotDict/blob/master/README.md#features"  target="_blank" rel="noreferrer noopener">Readme</a>.</h2>' );
	}
}

/**
 * Add a border and a legend for old strings (at least 6 months)
 *
 * @returns void
 */
function gd_mark_old_strings() {
	jQuery( 'tr.preview' ).each( function() {
		const id = jQuery( this ).attr( 'row' );
		let date_timestamp = Date.parse( jQuery( `#editor-${id} .meta dd:eq(1)` ).html().slice( 0, -3 ).trim() );
		date_timestamp = new Date( date_timestamp );
		const today = new Date();
		const months = today.getMonth() - date_timestamp.getMonth() + ( 12 * ( today.getFullYear() - date_timestamp.getFullYear() ) );
		if ( months > 6 ) {
			jQuery( this ).addClass( 'has-old-string' );
		}
	} );
}

/**
 * Highlight in preview the non-breaking-space
 * https://github.com/GlotPress/GlotPress-WP/issues/801
 *
 * @returns {void}
 */
function gd_non_breaking_space_highlight() {
	if ( ! gd_get_setting( 'no_non_breaking_space' ) ) {
		jQuery( 'tr.preview > td.translation.foreign-text, blockquote.translation > em > small' ).each( function() {
			const translation_item = jQuery( this ).html();
			if ( translation_item.indexOf( '&nbsp;' ) > -1 ) {
				jQuery( this ).html( DOMPurify.sanitize( translation_item.replace( /([^>])&nbsp;/g, '$1<span style="background-color:yellow">&nbsp;</span>' ) ) );
			}
		} );
	}
}

/**
 * Highlight in preview the curly apostrophe
 *
 * @returns {void}
 */
function gd_curly_apostrophe_highlight() {
	if ( ! gd_get_setting( 'curly_apostrophe_warning' ) ) {
		jQuery( 'tr.preview > td.translation.foreign-text, blockquote.translation > em > small' ).each( function() {
			const translation_item = jQuery( this ).html();
			if ( translation_item.indexOf( '’' ) > -1 ) {
				jQuery( this ).html( DOMPurify.sanitize( translation_item.replace( /([^>])’/g, '$1<span' +
            ' style="background-color:yellow">’</span>' ) ) );
			}
		} );
	}
}

/**
 * Get the language for consistency
 *
 * @returns string
 */
function gd_get_lang_consistency() {
	const lang = gd_get_lang();
	let reallang = '';
	if ( 'pt_BR' === lang ) {
		reallang = 'pt-br';
	} else if ( 'en_CA' === lang ) {
		reallang = 'en-ca';
	} else {
		reallang = lang.split( '_' );
		if ( typeof reallang[1] !== 'undefined' ) {
			reallang = reallang[1].toLowerCase();
		}
	}
	return reallang;
}

/**
 * Check if the string is the same
 *
 * @param {String} myString
 * @returns {Boolean}
 */
function gd_is_uppercase( myString ) {
	const lower = myString.toLowerCase();
	const upper = myString.toUpperCase();
	return ( lower !== upper && myString === upper );
}

/**
 * Stop event propagation
 *
 * @param {Object} e
 * @returns {void}
 */
function gd_stoppropagation( e ) {
	if ( 'object' === typeof e ) {
		e.stopImmediatePropagation();
	}
}

/**
 * Move the current locale first on Translate homepage.
 *
 * @returns {void}
 */
function gd_current_locale_first() {
	if ( 'https://translate.wordpress.org/' !== document.URL ) { return; }
	const locales_filter = document.querySelector( '#locales-filter' );
	const slug = gd_get_locale_slug( gd_get_lang(), 'locale' );
	const current_locale = document.querySelector( `#locales .english a[href="/locale/${slug}/"]` );
	const first_locale = document.querySelector( 'div.locale:first-child' );
	if ( ! current_locale ) { return; }
	const current_locale_div = current_locale.closest( 'div.locale' );
	if ( ! first_locale || ! current_locale_div || ! locales_filter ) { return; }
	const clone = current_locale_div.cloneNode( true );
	first_locale.before( clone );
	clone.classList.add( 'gd-locale-moved' );
	locales_filter.addEventListener( 'input', ( e ) => {
		if ( e.target.value !== '' ) {
			clone.style.display = 'none';
		} else {
			clone.style.display = 'block';
		}
	} );
}

/**
 * Auto hide next editor when status action open it.
 *
 * @param {object} editor
 * @returns {void}
 */
function gd_auto_hide_next_editor( editor ) {
	const preview = editor.nextElementSibling;
	if ( ! preview ) {
		return;
	}
	const next_editor = preview.nextElementSibling;
	const next_preview = next_editor.previousElementSibling;
	if ( ! next_editor || ! next_preview || ! next_editor.classList.contains( 'editor' ) || ! next_preview.classList.contains( 'preview' ) ) {
		return;
	}
	next_editor.style.display = 'none';
	next_preview.style.display = 'table-row';
}

/**
 * Mutations Observer for Translation Table Changes:
 * Auto hide next editor on status actions.
 * Add clone buttons on new preview rows and add glossary links.
 *
 * @triggers gd_add_column, gd_add_meta
 */
function gd_wait_table_alter() {
	if ( document.querySelector( '#translations tbody' ) !== null ) {
		const observer = new MutationObserver( ( mutations ) => {
			mutations.forEach( ( mutation ) => {
				const user_is_pte = document.querySelector( '#bulk-actions-toolbar-top' ) !== null;
				mutation.addedNodes.forEach( ( addedNode ) => {
					// Don't treat text nodes.
					if ( 1 !== addedNode.nodeType ) {
						return;
					}

					const row_is_preview = addedNode.classList.contains( 'preview' );
					const row_is_editor = addedNode.classList.contains( 'editor' );
					const is_new_translation = mutation.previousSibling && mutation.previousSibling.matches( '.editor.untranslated' );
					let status_has_changed = false;
					if ( row_is_editor && mutation.previousSibling && mutation.previousSibling.matches( '[class*="status-"]' ) ) {
						let status_before = '';
						let status_after = '';
						status_before = RegExp( /status-[a-z]*/ ).exec( mutation.previousSibling.className )[0];
						status_after = RegExp( /status-[a-z]*/ ).exec( addedNode.className )[0];
						status_has_changed = status_before !== status_after;
					}

					if ( user_is_pte && row_is_editor && ! is_new_translation && status_has_changed ) {
						gd_auto_hide_next_editor( addedNode );
					}
					if ( user_is_pte && row_is_preview ) {
						gd_add_column_buttons( addedNode );
					}
					if ( row_is_preview ) {
						addedNode.querySelectorAll( '.glossary-word' ).forEach( gd_add_glossary_links );
					}
				} );
				gd_add_meta();
			} );
		} );

		observer.observe( document.querySelector( '#translations tbody' ), {
			attributes:    true,
			childList:     true,
			characterData: true,
		} );
	}
}

/**
 * Creates HTML Element.
 *
 * @param {String} tagName This must be a valid HTML tag name.
 * @param {Object} attributes
 * @param {String} textContent
 * @returns {Element}
 */
function gd_create_element( tagName = 'div', attributes = {}, textContent = '' ) {
	const element = document.createElement( tagName );
	for ( const attribute in attributes ) {
		if ( attributes.hasOwnProperty( attribute ) ) {
			element.setAttribute( attribute, attributes[ attribute ] );
		}
	}
	element.textContent = textContent;
	return element;
}

/**
 * Inserts adjacent elements to all target selectors.
 *
 * @param {String} target_selector This must be valid CSS syntax.
 * @param {('beforebegin' | 'afterbegin' | 'beforeend' | 'afterend')} el_position
 * @param {Element} new_element
 * @returns {void}
 */
function gd_add_elements( target_selector, el_position, new_element ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.insertAdjacentElement( el_position, new_element.cloneNode( true ) );
	} );
}

/**
 * Adds event listeners for all target selectors.
 *
 * @param {Event} event_name
 * @param {String} target_selector This must be valid CSS syntax.
 * @param {Function} function_to_call
 * @returns {void}
 */
function gd_add_evt_listener( event_name, target_selector, function_to_call ) {
	document.querySelectorAll( target_selector ).forEach( ( el ) => {
		el.addEventListener( event_name, function_to_call );
	} );
}

/**
 * Copies text to clipboard.
 *
 * @param {String} copy_text
 * @returns {void}
 */
function gd_copy_to_clipboard( copy_text ) {
	const elem = document.createElement( 'textarea' );
	elem.value = copy_text;
	document.body.appendChild( elem );
	elem.select();
	document.execCommand( 'copy' );
	document.body.removeChild( elem );
}

/**
 * If sourceElement is outside viewport, add classElement to targetElement.
 *
 * @param {Element} sourceElement
 * @param {Element} targetElement
 * @param {String} classElement
 * @return {void}
 */
function gd_tag_target_when_source_outside_viewport( sourceElement, targetElement, classElement ) {
	const target = document.querySelector( targetElement );
	if ( ! target ) { return; }
	const observer = new IntersectionObserver( ( entries ) => {
		if ( true === entries[0].isIntersecting ) {
			target.classList.remove( classElement );
		} else {
			target.classList.add( classElement );
		}
	}, { threshold: [ 1 ], rootMargin: '80px' } );
	observer.observe( document.querySelector( sourceElement ) );
}

/**
 * Scroll to wporg header.
 *
 * @returns {void}
 */
function gd_scroll_to_top() {
	document.querySelector( '#wporg-header' ).scrollIntoView( {
		block:    'start',
		behavior: 'smooth',
	} );
}

function gd_build_sticky_header() {
	const translations = document.querySelector( '#translations' );
	if ( null === translations ) { return; }

	if ( null === localStorage.getItem( 'gd_header_is_sticky' ) ) {
		localStorage.setItem( 'gd_header_is_sticky', 'true' );
	}
	let gd_header_is_sticky = 'true' === localStorage.getItem( 'gd_header_is_sticky' );
	if ( gd_header_is_sticky ) {
		document.body.classList.add( 'gd-header-is-sticky' );
	}

	const title = document.querySelector( '.gp-content .breadcrumb+h2' );
	const filter_toolbar = document.querySelector( '.filter-toolbar' );
	const bulk_actions = document.querySelector( '#bulk-actions-toolbar-top' );
	const gd_review = document.querySelector( '.gd-review' );
	const paging_top = document.querySelector( '.paging' );
	const gd_notices_container = document.querySelector( '#gd-notices-container' );

	const toggle_sticky = document.createElement( 'DIV' );
	toggle_sticky.id = 'gd-toggle-header';
	toggle_sticky.classList.add( 'gd-toggle' );
	const toggle_sticky_input = document.createElement( 'INPUT' );
	toggle_sticky_input.id = 'gd-toggle-header-sticky';
	toggle_sticky_input.type = 'checkbox';
	toggle_sticky_input.classList.add( 'gd-toggle__input' );
	toggle_sticky_input.checked = gd_header_is_sticky ? 'checked' : '';
	toggle_sticky_input.addEventListener( 'click', ( e ) => {
		gd_header_is_sticky = ! gd_header_is_sticky;
		document.body.classList.toggle( 'gd-header-is-sticky' );
		localStorage.setItem( 'gd_header_is_sticky', ( ( true === gd_header_is_sticky ) ? 'true' : 'false' ) );
		e.stopPropagation();
	} );
	const toggle_sticky_label = document.createElement( 'LABEL' );
	toggle_sticky_label.htmlFor = 'gd-toggle-header-sticky';
	toggle_sticky_label.classList.add( 'gd-toggle__label' );
	toggle_sticky_label.title = 'Stick it and scroll!';
	toggle_sticky && toggle_sticky.append( toggle_sticky_input, toggle_sticky_label );
	const first_link = document.querySelector( '.gd-on-translations .gp-content h2 .glossary-link:first-child' );
	first_link && first_link.before( toggle_sticky );

	const fragment = document.createDocumentFragment();
	title && fragment.appendChild( title );
	filter_toolbar && fragment.appendChild( filter_toolbar );
	bulk_actions && fragment.appendChild( bulk_actions );
	gd_review && fragment.appendChild( gd_review );
	paging_top && fragment.appendChild( paging_top );
	gd_notices_container && fragment.appendChild( gd_notices_container );

	const gd_sticky_header = document.createElement( 'DIV' );
	gd_sticky_header.id = 'gd-sticky-header';
	gd_sticky_header.appendChild( fragment );
	translations.before( gd_sticky_header );
}
