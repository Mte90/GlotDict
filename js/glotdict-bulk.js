jQuery( '.bulk-action' ).append( jQuery( '<option>', {
	value: 'copy-from-original',
	text: 'Copy From Original',
} ) );

jQuery( '.bulk-actions' ).on( 'click', '.button', ( e ) => {
	if ( 'copy-from-original' === jQuery( '.bulk-action option:selected' ).val() ) {
		let copied_count = 0;
		let timeout = 0;
		$gp.editor.hide(); // Avoid validation on open editors that are empty.
		jQuery( 'tbody th.checkbox input:checked' ).each( function() {
			const checkbox = jQuery( this );
			const parent = checkbox.closest( 'tr' );
			const row = parent.attr( 'row' );
			if ( gd_get_setting( 'autosubmit_bulk_copy_from_original' ) ) {
				setTimeout( () => {
					$gp.editor.show( checkbox );
					jQuery( `#editor-${row} .translation-actions__copy` ).trigger( 'click' );
					jQuery( `#editor-${row} textarea.foreign-text` ).trigger( 'change' );
					jQuery( `#preview-${row}` ).addClass( 'has-original-copy' );
					if ( gd_get_setting( 'force_autosubmit_bulk_copy_from_original' ) ) {
						jQuery( `#editor-${row} button.translation-actions__save` ).addClass( 'forcesubmit' );
					}
					jQuery( `#editor-${row} button.translation-actions__save` ).trigger( 'click' );
					copied_count++;
					gd_copied_count_notice( copied_count );
				}, timeout );
				timeout += 2000;
			} else {
				$gp.editor.show( checkbox );
				jQuery( `#editor-${row} .translation-actions__copy` ).trigger( 'click' );
				jQuery( `#editor-${row} textarea.foreign-text` ).trigger( 'change' );
				jQuery( `#preview-${row}` ).addClass( 'has-original-copy' );
				copied_count++;
				gd_copied_count_notice( copied_count );
			}
		} );
		e.preventDefault();
		return false;
	}
} );

function gd_copied_count_notice( count ) {
	if ( count ) {
		jQuery( '#gd-copied-count' ).remove();
		jQuery( '#translations' ).before( `<div id="gd-copied-count" class="notice copied">${count}${count > 1 ? ' originals have ' : ' original has '}been copied.</div>` );
	}
}
