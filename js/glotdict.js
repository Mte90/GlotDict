'use strict';

const glotdict_version = '1.0.1';

// action = 'install', 'update', 'chrome_update', or 'shared_module_update'
const gd_extension_storage = ( null !== localStorage.getItem( 'gd_extension_status' ) ) ? JSON.parse( localStorage.getItem( 'gd_extension_status' ) ) : '';
const gd_extension = {
	changelog:       ( '' !== gd_extension_storage ) ? gd_extension_storage.changelog : '',
	currentVersion:  ( '' !== gd_extension_storage ) ? gd_extension_storage.currentVersion : '0',
	previousVersion: ( '' !== gd_extension_storage ) ? gd_extension_storage.previousVersion : '0',
	reason:          ( '' !== gd_extension_storage ) ? gd_extension_storage.reason : '',
}
const gd_thatsnew = gd_extension.currentVersion !== gd_extension.previousVersion;
const gd_setting = document.querySelector( '.gd_setting' );
if ( gd_setting && gd_thatsnew ) {
	gd_setting.click();
	document.querySelector( '#gd_settings_tab2' ).click();
}

const gd_user = {
	is_translator:      false,
	is_editor:          false,
	is_connected:       false,
	is_on_translations: false,
}
if ( ( 'undefined' !== typeof $gp_editor_options ) && '' === $gp_editor_options.can_approve ) {
	document.body.classList.add( 'gd-user-is-translator', 'gd-on-translations' );
	gd_user.is_translator = true;
	gd_user.is_on_translations = true;
}
if ( ( 'undefined' !== typeof $gp_editor_options ) && '1' === $gp_editor_options.can_approve ) {
	document.body.classList.add( 'gd-user-is-editor', 'gd-on-translations' );
	gd_user.is_editor = true;
	gd_user.is_on_translations = true;
}
gd_user.is_connected = document.querySelector( 'body.logged-in' ) !== null;

// Create notice container at the beginning since notices are added in AJAX
const translations = document.querySelector( '#translations' );
const gd_notices_container = document.createElement( 'DIV' );
gd_notices_container.id = 'gd-notices-container';
translations && translations.before( gd_notices_container );

gd_current_locale_first();

window.gd_filter_bar = jQuery( '.filter-toolbar form div:first' );

if ( window.gd_filter_bar.length > 0 ) {
	gd_hotkeys();
	// Fix for PTE align
	if ( jQuery( '#bulk-actions-toolbar-top' ).length > 0 ) {
		gd_add_column();
		if ( 0 === jQuery( '#bulk-actions-toolbar-bottom' ).length ) {
			jQuery( '#bulk-actions-toolbar-top' ).clone().css( 'float', 'none' ).insertBefore( '#legend' );
			jQuery( 'form.filters-toolbar.bulk-actions' ).submit( function() {
				const row_ids = jQuery( 'input:checked', jQuery( 'table#translations th.checkbox' ) ).map( function() {
					return jQuery( this ).parents( 'tr.preview' ).attr( 'row' );
				} ).get().join( ',' );
				jQuery( 'input[name="bulk[row-ids]"]', jQuery( this ) ).val( row_ids );
			} );
		}
	}
	if ( 1 === jQuery( '.preview' ).length ) {
		jQuery( '.preview .action' ).trigger( 'click' );
	}

	jQuery( "<div class='box has-glotdict'></div><div>Contains a Glossary term</div>" ).appendTo( '#legend' );
	jQuery( "<div class='box has-old-string'></div><div>The translation is at least 6 months old</div>" ).appendTo( '#legend' );
	jQuery( "<div class='box has-original-copy'></div><div>Contains the Original Copy</div>" ).appendTo( '#legend' );

	document.querySelectorAll( '.glossary-word' ).forEach( gd_add_glossary_links );

	gd_mark_old_strings();

	gd_locales_selector();

	jQuery( $gp.editor.table ).onFirst( 'click', 'button.translation-actions__save:not(.forcesubmit)', gd_validate_visible );
}

gd_add_project_links();
gd_add_review_button();
gd_add_scroll_buttons();
gd_add_meta();

jQuery( '.glotdict_language' ).change( () => {
	localStorage.setItem( 'gd_language', jQuery( '.glotdict_language option:selected' ).text() );
	localStorage.setItem( 'gd_glossary_date', '' );
	gd_locales();
	location.reload();
} );

jQuery( '.glossary-word' ).contextmenu( function( e ) {
	const info = jQuery( this ).data( 'translations' );
	jQuery( '.editor:visible textarea:visible' )
		.val( jQuery( '.editor:visible textarea:visible' ).val() + info[ 0 ].translation )
		.focus();
	e.preventDefault();
	return false;
} );

jQuery( '.gp-content' ).on( 'click', '.discard-glotdict', function( e ) {
	const $this = jQuery( this );
	const row = $this.data( 'row' );
	jQuery( `#editor-${row}` ).data( 'discard', 'true' );
	$this.parent().remove();
	if ( 0 === jQuery( `#editor-${row} .gd-warning` ).length ) {
		jQuery.removeData( `#editor-${row}`, 'discard' );
	}
	if ( 0 === jQuery( `#editor-${row} .warning` ).length ) {
		jQuery( `#editor-${row}` ).removeClass( 'has-warnings' ).addClass( 'no-warnings' );
		jQuery( `#preview-${row}` ).removeClass( 'has-warnings' ).addClass( 'no-warnings' );
	}
	e.preventDefault();
	return false;
} );

if ( gd_get_setting( 'autocopy_string_on_translation_opened' ) ) {
	jQuery( $gp.editor.table ).on( 'click', 'a.edit', function() {
		setTimeout(() => { gd_copy_visible_original_string() }, 400);
	} );
	jQuery( $gp.editor.table ).on( 'dblclick', 'tr.preview td', function() {
		setTimeout(() => { gd_copy_visible_original_string() }, 400);
	} );
}

jQuery( '.gp-content' ).on( 'click', '.gd-review:not(.gd-review-done)', function( e ) {
	jQuery( this ).val( 'Review in progress' );
	gd_run_review();
	jQuery( this ).val( 'Review Complete' ).removeClass( 'gd-review' ).addClass( 'gd-review-done' ).attr( 'disabled', 'disabled' );
} );

gd_selected_count();

gd_non_breaking_space_highlight();

gd_curly_apostrophe_highlight();

const gd_to_top = document.createElement( 'A' );
gd_to_top.id = 'gd-back-to-top';
gd_to_top.textContent = '↑';
gd_to_top.title = 'Back to top  🚀';
document.body.appendChild( gd_to_top );

gd_tag_target_when_source_outside_viewport( '#masthead', 'body', 'gd-header-is-hidden' );

gd_to_top.addEventListener( 'click', ( e ) => {
	e.preventDefault();
	gd_scroll_to_top();
} );

gd_user.is_connected && gd_build_sticky_header();

gd_wait_table_alter();
