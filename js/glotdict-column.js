function gd_add_column() {
	if ( jQuery( '#translations thead tr th' ).length < 6 ) {
		jQuery( '#translations thead tr' ).append( '<th></th>' );
	}
	jQuery( '#translations tr.preview' ).each( function() {
		if (jQuery(this).find('td').length < 5) {
			let timeout = 0
			let WPTF_active = get_WPTF()	
			if (WPTF_active === true) {
				timeout = 200
			}
			setTimeout(() => {
				gd_add_column_buttons(this);
			}, timeout);
		}
	} );
}

function gd_add_column_buttons(tr_preview) {
	let WPTF_active = get_WPTF()
	
	
	const td_buttons = document.createElement( 'TD' );
	tr_preview.append( td_buttons );
	tr_preview.nextElementSibling.querySelectorAll('.status-actions button.approve,.status-actions button.reject,.status-actions button.fuzzy').forEach((button) => {
		 button.removeAttribute( 'tabindex' );
		 const clone_button = button.cloneNode( true );
		 clone_button.classList.add( 'gd-button' );
		 clone_button.addEventListener( 'click', ( e ) => {
			const button = ( 'BUTTON' === e.target.parentElement.nodeName ) ? e.target.parentElement : e.target;
			if ( ! button ) { return; }
			const strong = button.querySelector( 'strong' );
			button.disabled = true;
			button.style.color = '#afafaf';
			if ( strong ) {
				strong.classList.add( 'gd-btn-action' );
			}
			const editor = button.closest( 'tr.preview' ).nextElementSibling;
			const status_classes = button.classList;
			status_classes.remove( 'button', 'gd-button', 'is-primary' );
			let new_status = status_classes[0];
			new_status = 'approve' === new_status ? 'current' : new_status;
			new_status = 'reject' === new_status ? 'rejected' : new_status;
			$gp.editor.show( jQuery( button ) );
			$gp.editor.set_status( jQuery( button ), new_status );
			if ( editor ) {
				editor.style.display = 'none';
			}
			button.closest( 'tr.preview' ).style.display = 'table-row';
		} );
		if ( ! tr_preview.classList.contains( 'untranslated' ) ) {
			td_buttons.append( clone_button );
			}
	} );
}
