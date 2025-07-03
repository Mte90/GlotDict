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
	window.glotdict_locales = [ 'ast', 'bel', 'bg_BG', 'cy', 'da_DK', 'de_DE', 'en_AU', 'en_CA', 'en_GB', 'es_ES', 'fi', 'fr_FR', 'he_IL', 'hi_IN', 'hr_HR', 'it_IT', 'ja', 'ko_KR', 'lt_LT', 'lv_LV', 'nl_BE', 'nl_NL', 'pt_BR', 'ro_RO', 'sv_SE', 'th', 'tr_TR', 'uk' ];
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
		const titleLinksContainer = document.createElement( 'SPAN' );
		titleLinksContainer.id = 'gd_title_links';
		document.querySelector( '.gp-content h2' ).appendChild( titleLinksContainer );
		jQuery( '#gd_title_links' ).append( `<a class="glossary-link" href="https://translate.wordpress.org/locale/${lang}/default" target="_blank" rel="noreferrer noopener">${jQuery( '.gp-content .breadcrumb li:last-child a' ).text()} Projects</a>` + '<a class="glossary-link" href="https://translate.wordpress.org/stats" target="_blank" rel="noreferrer noopener">Translation Global Status</a>' );
	
		const titleLinks = document.querySelector( '#gd_title_links' );
		const glossaryLinks = document.querySelector( '.gp-heading>h2+.glossary-links' );
		if ( glossaryLinks ) {
			titleLinks.append( glossaryLinks );
		}
		const glossaryLinksSeparator = document.querySelector( '#gd_title_links .glossary-links .separator' );
		glossaryLinksSeparator && glossaryLinksSeparator.remove();
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
	if ( jQuery( 'body.logged-in' ).length !== 0 && jQuery('.discussions-table-head').length === 0 ) {
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
	};

	let slug = gd_get_locale_slug( gd_get_lang(), 'locale' );

	const lang = gd_get_lang();
	slug = slug.replace( /de/, 'de/default' );
	slug = slug.replace( /nl/, 'nl/default' );
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
				return gd_get_lang() === el.textContent.trim();
			} )[0];
			jQuery( '.gd_scroll' ).on( 'click', () => {
				const target = StatsSpecificLinks || document.querySelector( `table tr th a[href*="/${slug}/"]` ) || document.querySelector( `table td strong a[href*="/${slug}/"]` );
				if ( ! target ) { return; }
				const row = target.closest( 'tr' );
				if ( ! row ) { return; }
				row.style.border = '2px solid black';
				target.style.color = '#a70505';
				if ( ! target.textContent.includes( '➤' ) ) {
					target.textContent = `➤ ${target.textContent}`;
				}
				jQuery( 'html, body' ).animate( {
					scrollTop: jQuery( row ).offset().top - 160,
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
	let my_hide_lang_selector = gd_get_setting("hide_lang_selector")
        if (my_hide_lang_selector === null) { 
           my_hide_lang_selector = false
        }
	const lang = gd_get_lang();
	if (my_hide_lang_selector === false) { 
	    window.gd_filter_bar.append( `<span class="separator">•</span><div class="gd-language-picker-container${( '' === lang || false === lang ) ? ' empty-locale' : ''}"><label for="gd-language-picker">Pick locale</label><select id="gd-language-picker" class="glotdict_language"></select></div>` );
	    jQuery( '.glotdict_language' ).append( jQuery( '<option></option>' ) );
	    const gd_locales_array = gd_locales();
	    var browserlanguage = Intl.DateTimeFormat().resolvedOptions().locale;
	    browserlanguage = browserlanguage.replace('-', '_');
	    jQuery.each( gd_locales_array, ( key, value ) => {
		const new_option = jQuery( '<option></option>' ).attr( 'value', value ).text( value );
		if ( lang === value || lang === '' && browserlanguage === value ) {
			new_option.attr( 'selected', true );
		}
		jQuery( '.glotdict_language' ).append( new_option );
	     } );
	     jQuery( '.glotdict_language' ).change( () => {
		localStorage.setItem( 'gd_language', jQuery( '.glotdict_language option:selected' ).text() );
		localStorage.setItem( 'gd_glossary_date', '' );
		gd_locales();
		location.reload();
	} );
	}
}

/**
 * Get Global Handbook URL for current locale and populates gd_glossary global constant
 * Don't check if handbook exists
 *
 * @return void
 */
function gd_get_handbook_link() {
	const slug = gd_get_locale_slug( gd_get_lang(), 'locale' );
	const global_handbook_url = `https://${slug}.wordpress.org/team/handbook/`;
	gd_glossary.handbook_url  = global_handbook_url;
}

/**
 * Get Global Glossary URL for current locale
 * Don't check if it exists
 *
 * @return string Global glossary URL
 */
function gd_get_global_glossary_url() {
	const slug = gd_get_locale_slug( gd_get_lang(), 'locale' );
	if (slug === '') {
		return false;
	}

	const global_glossary_url = `https://translate.wordpress.org/locale/${slug}/default/glossary/`;
	return global_glossary_url;
}

/**
 * Get Locale glossary page HTML, treat data and populate gd_glossary global constant
 *
 * @return string HTML of glossary page
 */
function gd_get_glossary_global_data() {
	gd_get_handbook_link();
	const global_glossary_url = gd_get_global_glossary_url();
	if (global_glossary_url === false) {
		gd_locales_selector();
		return;
	}

	fetch( global_glossary_url )
	.then( ( response ) => response.text() )
	.then( ( glossary_data ) => {
		gd_glossary.glossary_url = global_glossary_url;
		return glossary_data;
	} )
	.then( ( glossary_data ) => {
		gd_extract_glossary_data( glossary_data );
	} )
	.then( () => {
		gd_add_official_links_to_filters();
	} )
	.then( () => {
		gd_locales_selector();
	} )
	.catch( () => {
		gd_locales_selector();
	} );
}

/**
 * Extract data from Glossary and populates gd_glossary global constant
 *
 * @returns void
 */
function gd_extract_glossary_data( glossary_data ) {
	gd_user.is_gte = null !== glossary_data.match( /href="\/glossaries\/[0-9]*\/-edit/gmi );
	gd_user.is_gte && document.body.classList.add( 'gd-user-is-gte' );

	const glossary_description = glossary_data.replace( /(\r\n|\n|\r)/gm, '' ).match( /(?<=glossary-description">)(.*?)(?=<\/div>)/gmi ); 
	if ( Array.isArray( glossary_description ) && glossary_description.length ) {
		const description_data = `<div>${glossary_description[0]}</div>}`;
		const html_document = new DOMParser().parseFromString( description_data, 'text/html' );
		const guide_link = html_document.querySelector( '#gd-guide-link' );
		if ( guide_link ) {
			gd_glossary.guide.url = guide_link.href;
			gd_glossary.guide.title = guide_link.dataset.title;
		}
	}
}

/**
 * Add official links to filters links
 *
 * @returns void
 */
function gd_add_official_links_to_filters() {
	const gd_guide_link = document.createElement('A');
	gd_guide_link.id = 'gd-guide-link';
	gd_guide_link.target = '_blank';
	gd_guide_link.textContent = '' !== gd_glossary.guide.title ? gd_glossary.guide.title : 'Translation Style Guide';

	if ( '' !== gd_glossary.guide.url ) {
		gd_guide_link.href = gd_glossary.guide.url;
	}

	if ( '' === gd_glossary.guide.url && '' !== gd_glossary.handbook_url ) {
		gd_guide_link.href = gd_glossary.handbook_url;
	}

	const filter_toolbars_div = document.querySelector('.filters-toolbar>div:first-child');
	const gp_separator = document.createElement('SPAN');
	gp_separator.classList.add( 'separator' );
	gp_separator.textContent = '•';
	if ( ! filter_toolbars_div ) {
		return;
	}
	if ( '' !== gd_glossary.glossary_url ) {
		filter_toolbars_div.append( gp_separator );
	}
	if ( gd_guide_link && ( '' !== gd_glossary.guide.url || '' !== gd_glossary.handbook_url ) ) {
		filter_toolbars_div.append( gd_guide_link );
	}
}

function gd_set_gte_settings() {
}

/**
 * Add a border and a legend for old strings (at least 6 months)
 *
 * @returns void
 */
function gd_mark_old_strings() {
	jQuery( 'tr.preview' ).each( function() {
		const id = jQuery( this ).attr( 'row' );
		let date_timestamp = Date.parse( jQuery( `#editor-${id} .meta dl:eq(1)` ).html().slice( 0, -3 ).trim() );
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
					if ( row_is_editor ) {
						const editor_id = `#${addedNode.id}`;
						gd_add_string_counts( editor_id );
						gd_quicklinks( editor_id );
						gd_consistency( editor_id );
						gd_notranslate( editor_id );
						gd_localize_date( editor_id );
					}
				} );
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
	navigator.clipboard.writeText( copy_text );
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
	document.querySelector( '#masthead' ).scrollIntoView( {
		block:    'start',
		behavior: 'smooth',
	} );
}

/**
 * Generate the sticky header
 *
 * @returns {void}
 */
function gd_build_sticky_header() {
	if ( ! gd_user.is_on_translations ) { return; }

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
	const translations = document.querySelector( '#translations' );
	translations && translations.before( gd_sticky_header );
}

/**
 * Copy the original string using Clipboard API
 *
 * @returns {void}
 */
function gd_copy_visible_original_string() {
	gd_copy_to_clipboard( document.querySelector( '.editor[style="display: table-row;"] .original-raw' ).innerHTML );
}

/**
 * Adds an anonimous check next to the author filter field
 * @returns {void}
 */
function gd_anonymous() {
	const user_filter_el = document.getElementById( 'filters[user_login]' );
	if ( ! user_filter_el ) {
		return;
	}
	const anonymous = document.createElement( 'div' );
	const anonymous_input = gd_create_element( 'input', { 'type': 'checkbox', 'id': 'gd_search_anonymous' } );
	const anonymous_label = gd_create_element( 'label', { 'for': 'gd_search_anonymous' }, 'Anonymous author' );
	anonymous.append( anonymous_input, anonymous_label );
	user_filter_el.insertAdjacentElement( 'afterend', anonymous );
	anonymous_input.addEventListener( 'click', ( event ) => {
		if ( event.target.checked ) {
			document.getElementById( 'filters[user_login]' ).value = 'anonymous';
			return;
		}
		document.getElementById( 'filters[user_login]' ).value = '';
	} );
}

/**
 * Adds dropdown pagination
 * @returns {void}
 */
function gd_pagination() {
	const default_pagination = document.querySelectorAll( '.paging' );
	if ( ! default_pagination.length ) {
		return;
	}

	const pages = default_pagination[ 0 ].querySelectorAll( 'a' );
	if ( ! pages.length ) {
		return;
	}

	const last_page = {};
	if ( '→' === pages[ pages.length - 1 ].textContent ) {
		last_page.id = parseInt( pages[ pages.length - 2 ].textContent );
		last_page.url = pages[ pages.length - 2 ].href;
	} else {
		last_page.id = parseInt( pages[ pages.length - 1 ].textContent ) + 1;
		last_page.url = pages[ pages.length - 1 ].href;
	}

	const gd_pagination = document.createElement( 'select' );
	const option = document.createElement( 'option' );
	gd_pagination.className = 'gd-pagination';

	const current = parseInt( default_pagination[ 0 ].querySelector( '.current' ).textContent );

	for ( let i = 1; i <= last_page.id; i++ ) {
		const this_option = option.cloneNode( true );
		this_option.value = i;
		this_option.textContent = i;
		if ( i === current ) {
			this_option.className = 'current-page';
		}
		gd_pagination.appendChild( this_option );
	}

	default_pagination.forEach( default_pagination_instance => {
		const this_gd_pagination = gd_pagination.cloneNode( true );
		this_gd_pagination.addEventListener( 'change', ( ev ) => { window.location = last_page.url.replace( /page=\d+/, `page=${ev.target.value}` ); } );
		default_pagination_instance.insertAdjacentElement( 'beforeend', this_gd_pagination );
	} );

	document.querySelectorAll( '.gd-pagination .current-page' ).forEach( el => { el.selected = true; } );
}

/**
 * Counts the occurrences of a subString in a string
 * Algorithm by Vitim.us at https://gist.github.com/victornpb/7736865
 *
 * @param {String} string
 * @param {String} subString
 * @return {number}
 */
function gd_occurrences( string, subString ) {
	string = `${string.toLowerCase()}`;
	subString = `${subString.toLowerCase()}`;
	if ( subString.length <= 0 ) { return ( string.length + 1 ); }
	let n = 0, pos = 0;
	const step = subString.length;
	while ( true ) {
		pos = string.indexOf( subString, pos );
		if ( pos >= 0 ) { ++n; pos += step; } else { break; }
	}
	return n;
}
