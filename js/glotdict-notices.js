/* Add Currently Selected Count */
function gd_selected_count() {
	if ( ! gd_user.is_on_translations ) { return; }

	if ( jQuery( '#gd-checked-count' ).length ) {
		jQuery( '#gd-checked-count' ).remove();
	}
	const checked_count = jQuery( 'tbody .checkbox :checkbox:checked' ).length;
	if ( checked_count > 0 ) {
		let current_selectedcount = 0;
		let waiting_selectedcount = 0;
		let fuzzy_selectedcount = 0;
		let old_selectedcount = 0;
		let rejected_selectedcount = 0;
		let untranslated_selectedcount = 0;
		let nowarnings_selectedcount = 0;
		let warnings_selectedcount = 0;
		let glotdict_selectedcount = 0;
		jQuery( 'tbody .checkbox :checkbox:checked' ).each( function( index ) {
			const row = jQuery( this ).closest( 'tr.preview' );
			if ( row.hasClass( 'status-current' ) ) {
				current_selectedcount++;
			}
			if ( row.hasClass( 'status-waiting' ) ) {
				waiting_selectedcount++;
			}
			if ( row.hasClass( 'status-fuzzy' ) ) {
				fuzzy_selectedcount++;
			}
			if ( row.hasClass( 'status-old' ) ) {
				old_selectedcount++;
			}
			if ( row.hasClass( 'status-rejected' ) ) {
				rejected_selectedcount++;
			}
			if ( row.hasClass( 'untranslated' ) ) {
				untranslated_selectedcount++;
			}
			if ( row.hasClass( 'no-warnings' ) ) {
				nowarnings_selectedcount++;
			}
			if ( row.hasClass( 'has-warnings' ) ) {
				warnings_selectedcount++;
			}
			if ( row.hasClass( 'has-glotdict' ) ) {
				glotdict_selectedcount++;
			}
		} );
		const selected_strings_text = [];
		if ( current_selectedcount > 0 ) {
			let current_string_text = `${current_selectedcount} current string`;
			if ( current_selectedcount > 1 ) {
				current_string_text += 's';
			}
			selected_strings_text.push( current_string_text );
		}
		if ( waiting_selectedcount > 0 ) {
			let waiting_string_text = `${waiting_selectedcount} waiting string`;
			if ( waiting_selectedcount > 1 ) {
				waiting_string_text += 's';
			}
			selected_strings_text.push( waiting_string_text );
		}
		if ( fuzzy_selectedcount > 0 ) {
			let fuzzy_string_text = `${fuzzy_selectedcount} fuzzy string`;
			if ( fuzzy_selectedcount > 1 ) {
				fuzzy_string_text += 's';
			}
			selected_strings_text.push( fuzzy_string_text );
		}
		if ( old_selectedcount > 0 ) {
			let old_string_text = `${old_selectedcount} old string`;
			if ( old_selectedcount > 1 ) {
				old_string_text += 's';
			}
			selected_strings_text.push( old_string_text );
		}
		if ( rejected_selectedcount > 0 ) {
			let rejected_string_text = `${rejected_selectedcount} rejected string`;
			if ( rejected_selectedcount > 1 ) {
				rejected_string_text += 's';
			}
			selected_strings_text.push( rejected_string_text );
		}
		if ( untranslated_selectedcount > 0 ) {
			let untranslated_string_text = `${untranslated_selectedcount} untranslated string`;
			if ( untranslated_selectedcount > 1 ) {
				untranslated_string_text += 's';
			}
			selected_strings_text.push( untranslated_string_text );
		}
		if ( nowarnings_selectedcount > 0 ) {
			let nowarnings_string_text = `${nowarnings_selectedcount} string`;
			if ( nowarnings_selectedcount > 1 ) {
				nowarnings_string_text += 's';
			}
			nowarnings_string_text += ' with no warnings';
			// selected_strings_text.push(nowarnings_string_text); - Suppressed as unnecessary
		}
		if ( warnings_selectedcount > 0 ) {
			let warnings_string_text = `${warnings_selectedcount} string`;
			if ( warnings_selectedcount > 1 ) {
				warnings_string_text += 's';
			}
			warnings_string_text += ' with warnings';
			selected_strings_text.push( warnings_string_text );
		}
		if ( glotdict_selectedcount > 0 ) {
			let glotdict_string_text = `${glotdict_selectedcount} string`;
			if ( glotdict_selectedcount > 1 ) {
				glotdict_string_text += 's';
			}
			glotdict_string_text += ' with Glossary terms';
			selected_strings_text.push( glotdict_string_text );
		}
		jQuery( '#gd-notices-container' ).append( `<div id="gd-checked-count" class="notice">${checked_count}${checked_count > 1 ? ' rows are ' : ' row is '} selected.</div>` );
		if ( Array.isArray( selected_strings_text ) && selected_strings_text.length > 0 ) {
			jQuery( '#gd-checked-count' ).append( ` (${selected_strings_text.join( ', ' )}.)` );
		}
	}
}

/* Trigger Currently Selected ReCount on Checkbox Click */
jQuery( document ).on( 'click', '.checkbox :checkbox', ( e ) => {
	gd_selected_count();
} );

/* Attach to ajaxSuccess to track Approve/Reject/Fuzzy Status Setting */
let approved_count = 0;
let rejected_count = 0;
let fuzzied_count = 0;
let submitted_count = 0;
jQuery( document ).ajaxSuccess( ( event, xhr, settings ) => {
	if ( settings.url === $gp_editor_options.set_status_url ) {
		gd_selected_count();
		const pairs = settings.data.split( '&' );
		const data = [];
		for ( let i = 0; i < pairs.length; i++ ) {
			const pair = pairs[i].split( '=' );
			data[pair[0]] = pair[1];
		}
		switch ( data['status'] ) {
		case 'current':
			jQuery( '#gd-approved-count' ).remove();
			approved_count++;
			jQuery( '#gd-notices-container' ).append( `<div id="gd-approved-count" class="notice approved">${approved_count}${approved_count > 1 ? ' translations have ' : ' translation has '}been approved.</div>` );
			break;
		case 'rejected':
			jQuery( '#gd-rejected-count' ).remove();
			rejected_count++;
			jQuery( '#gd-notices-container' ).append( `<div id="gd-rejected-count" class="notice rejected">${rejected_count}${rejected_count > 1 ? ' translations have ' : ' translation has '}been rejected.</div>` );
			break;
		case 'fuzzy':
			jQuery( '#gd-fuzzied-count' ).remove();
			fuzzied_count++;
			jQuery( '#gd-notices-container' ).append( `<div id="gd-fuzzied-count" class="notice fuzzied">${fuzzied_count}${fuzzied_count > 1 ? ' translations have ' : ' translation has '}been fuzzied.</div>` );
			break;
		}
	} else if ( settings.url === $gp_editor_options.url ) {
		gd_selected_count();
		jQuery( '#gd-submitted-count' ).remove();
		submitted_count++;
		jQuery( '#gd-notices-container' ).append( `<div id="gd-submitted-count" class="notice submitted">${submitted_count}${submitted_count > 1 ? ' translations have ' : ' translation has '}been submitted.</div>` );
	}
} );
