/**
 * Run the review
 *
 * @returns void
 */
function gd_run_review() {
	let review_count = 0;
	let review_error_count = 0;
	jQuery( '#gd-review-count' ).remove();
	jQuery( 'tr.preview' ).each( function() {
		const $preview = jQuery( this );
		const editor = `#editor-${$preview.attr( 'row' )}:not(.untranslated)`;
		const howmany = gd_validate( '', editor );
		if ( howmany > 0 ) {
			review_error_count += howmany;
		}
		review_count++;
	} );
	if ( review_count ) {
		if ( review_error_count ) {
			jQuery( '#gd-notices-container' ).append( `<div id="gd-review-count" class="notice reviewed warned">${review_count}${review_count > 1 ? ' translations have ' : ' translation has '}been reviewed. (${review_error_count}${review_error_count > 0 ? ' warnings have ' : ' warning has '}been flagged).</div>` );
		} else {
			jQuery( '#gd-notices-container' ).append( `<div id="gd-review-count" class="notice reviewed">${review_count}${review_count > 1 ? ' translations have ' : ' translation has '}been reviewed. (No warnings have been flagged).</div>` );
		}
	}
}

/**
 * Check if in the translations there aren't the translation suggested
 *
 * @param {object} e The event.
 * @param {object} selector The selector.
 *
 * @returns void
 */
function gd_search_glossary_on_translation( e, selector ) {
	const SINGULAR = 0;
	const PLURAL = 1;

	let howmany = 0;
	if ( gd_get_setting( 'no_glossary_term_check' ) ) {
		return howmany;
	}
	const discard = gd_get_discard_link( selector );

	jQuery( selector ).each( function() {
		const $editor = jQuery( this );
		const translations = jQuery( 'textarea.foreign-text', $editor );
		const originals = jQuery( '.original, .original-text', $editor );

		let original_index = SINGULAR;
		if ( 2 === originals.length && 1 === translations.length ) {
			original_index = PLURAL; // For locales where nplural === 1.
		}

		translations.each( ( i, translation ) => {
			const glossary_words = jQuery( '.glossary-word', originals[original_index] ).map( function() {return this.textContent;} ).get();
			const words_with_warning = [];
			jQuery( '.glossary-word', originals[original_index] ).each( ( j, glossary_element ) => {
				const glossary_word = glossary_element.textContent.toLowerCase();

				if ( words_with_warning.includes( glossary_word ) ) {
					return true;
				}
				const glossary_word_occurrence = glossary_words.filter( word => word.toLowerCase() === glossary_word ).length;
				const glossary_word_translations = jQuery( glossary_element ).data( 'translations' );
				let reset = '';
				let count = '';
				const term = jQuery( glossary_element ).html();
				jQuery( glossary_word_translations ).each( ( index ) => {
					if ( 'N/A' === glossary_word_translations[index].translation ) {
						return true;
					}
					const translation_word_occurrence = gd_occurrences( translation.value, glossary_word_translations[index].translation );
					if ( translation_word_occurrence < glossary_word_occurrence ) {
						words_with_warning.push( glossary_word );
						reset = `${reset}“<b>${glossary_word_translations[index].translation}</b>“, `;
						const diff = glossary_word_occurrence - translation_word_occurrence;
						count = `${diff} time${diff > 1 ? 's' : ''}`;
					} else {
						reset = '';
						return false;
					}
				} );
				if ( reset !== '' ) {
					howmany++;
					reset = reset.slice( 0, -2 );
					let message = 'The translation is missing the suggested translation';
					if ( glossary_word_translations.length > 1 ) {
						message = 'The translation does not contain any of the suggested translations';
					}
					const form = translations.length > 1 ? ( original_index === SINGULAR ? ' for singular' : ' for plural' ) : '';
					jQuery( '.textareas', $editor ).prepend( gd_get_warning( `${message} (${reset}) for the term “<i>${term}</i>“ ${count}${form}.`, discard ) );
				}
			} );
			original_index = PLURAL;
		} );
	} );
	if ( howmany !== 0 ) {
		gd_stoppropagation( e );
	}
	return howmany;
}

/**
 * Validation is good to save time!
 *
 * @param {object} e The event.
 * @param {string} selector The selector.
 *
 * @returns void
 */
function gd_validate( e, selector ) {
	let howmany = 0;
	if ( 'undefined' === typeof jQuery( selector ).data( 'discard' ) ) {
		jQuery( '.gd-warning', selector ).remove();
		howmany += jQuery( '.warning:not(.gd-warning):has(> a.discard-warning)', selector ).length;
		howmany += gd_search_glossary_on_translation( e, selector );
		const newtext = jQuery( 'textarea', selector ).val();
		const discard = gd_get_discard_link( selector );
		if ( 'undefined' === typeof newtext || '' === newtext ) {
			jQuery( '.textareas', selector ).prepend( gd_get_warning( 'The translation seems empty!', discard ) );
			howmany++;
			return;
		}
		const originaltext = jQuery( '.original', selector ).text();
		const lastcharoriginaltext = originaltext.slice( -1 );
		const firstcharoriginaltext = originaltext.charAt( 0 );
		const hellipseoriginaltext = '...' === originaltext.slice( -3 );
		const lastcharnewtext = newtext.slice( -1 );
		const firstcharnewtext = newtext.charAt( 0 );
		const last_dot = [ ';', '.', '!', ':', '、', '。', '؟', '？', '！' ];
		if ( hellipseoriginaltext ) {
			if ( ! gd_get_setting( 'no_final_dot' ) ) {
				if ( '...' === jQuery( 'textarea', selector ).val().slice( -3 ) || ( lastcharnewtext !== ';' && lastcharnewtext !== '.' && lastcharnewtext !== '…' ) ) {
					jQuery( '.textareas', selector ).prepend( gd_get_warning( 'The translation contains a final <b>...</b> that should be translated as either <b><code>…</code></b> or <b><code>&amp;hellip;</code></b>', discard ) );
					howmany++;
				}
			}
		} else {
			if ( ! gd_get_setting( 'no_final_other_dots' ) ) {
				if ( jQuery.inArray( lastcharoriginaltext, last_dot ) > 0 && -1 === jQuery.inArray( lastcharnewtext, last_dot ) ) {
					jQuery( '.textareas', selector ).prepend( gd_get_warning( 'The translation is missing an ending <b>.</b> or <b>?</b> or <b>!</b>', discard ) );
					howmany++;
				}
			}
		}
		if ( ! gd_get_setting( 'no_initial_uppercase' ) ) {
			if ( gd_is_uppercase( firstcharoriginaltext ) && ! gd_is_uppercase( firstcharnewtext ) ) {
				jQuery( '.textareas', selector ).prepend( gd_get_warning( `The translation is missing an initial uppercase letter as "<i>${firstcharnewtext}</i>" is an initial uppercase letter present on the original string.`, discard ) );
				howmany++;
			}
		}
		if ( ! gd_get_setting( 'no_initial_space' ) ) {
			if ( ( ' ' === firstcharoriginaltext && firstcharnewtext !== ' ' ) || ( ' ' === firstcharoriginaltext && firstcharnewtext !== ' ' ) ) {
				jQuery( '.textareas', selector ).prepend( gd_get_warning( 'The translation is missing an initial space or non-breaking space.', discard ) );
				howmany++;
			}
		}
		if ( ! gd_get_setting( 'no_trailing_space' ) ) {
			if ( ( ' ' === lastcharoriginaltext && lastcharnewtext !== ' ' ) || ( ' ' === lastcharoriginaltext && lastcharnewtext !== ' ' ) ) {
				jQuery( '.textareas', selector ).prepend( gd_get_warning( 'The translation is missing an ending space or non-breaking space.', discard ) );
				howmany++;
			}
		}
		if ( gd_get_setting( 'curly_apostrophe_warning' ) ) {
			if ( newtext.indexOf( "'" ) > -1 ) {
				jQuery( '.textareas', selector ).prepend( gd_get_warning( 'The translation is using straight apostrophes instead of curly ones. Please check them against your Locale guidelines.', discard ) );
				howmany++;
			}
		}
		if ( gd_get_setting( 'localized_quote_warning' ) ) {
			let check_quotes = newtext;
			check_quotes = check_quotes.replace( /([^>"]*)"(?=[^<]*>)/g, '$1#GDATTR#' );
			if ( check_quotes.indexOf( '"' ) > -1 ) {
				jQuery( '.textareas', selector ).prepend( gd_get_warning( 'The translation is using straight quotes instead of typographic ones. Please check them against your Locale guidelines.', discard ) );
				howmany++;
			}
			check_quotes = check_quotes.replace( /#GDATTR#/g, '"' );
		}
	}
	if ( howmany !== 0 ) {
		jQuery( selector ).removeClass( 'no-warnings' ).addClass( 'has-warnings' );
		const previewSelector = `#preview-${jQuery( selector ).attr( 'row' )}`;
		jQuery( previewSelector ).removeClass( 'no-warnings' ).addClass( 'has-warnings' );
		gd_stoppropagation( e );
	}
	return howmany;
}

function gd_validate_visible( e ) {
	if ( jQuery( this ).hasClass( 'forcesubmit' ) ) {return;}
	const selector = '.editor:visible';
	const howmany = gd_validate( e, selector );
	if ( typeof howmany !== 'undefined' && howmany !== 0 ) {
		const msg = 'Submission blocked! You need to dismiss all warnings and re-submit the string.';
		$gp.notices.error( msg );
	} else {
		const interval = setInterval( () => {
			const $notice = jQuery( '#gp-js-message' );
			if ( ! $notice.hasClass( 'gp-js-notice' ) ) {
				if ( $notice.hasClass( 'gp-js-success' ) ) {
					gd_non_breaking_space_highlight();
				}
				clearInterval( interval );
			}
		}, 500 );
	}
}

/**
 * Get the discard link
 *
 * @param {String} selector
 * @returns {String}
 */
function gd_get_discard_link( selector ) {
	return ` <a href="#" class="discard-glotdict" data-row="${jQuery( selector ).attr( 'row' )}">Discard</a>`;
}

/**
 * Get the warning link
 *
 * @param {String} text
 * @param {String} discard
 * @returns {String}
 */
function gd_get_warning( text, discard ) {
	return `<div class="warning secondary gd-warning"><strong>Warning:</strong> ${text}</strong>${discard}</div>`;
}
