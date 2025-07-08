function gd_add_column() {
		let header = document.querySelector('#translations thead tr')
		const thCount = header.querySelectorAll('th').length;
		if (thCount < 6) {
			jQuery('#translations thead tr').append('<th></th>');
			}
			jQuery('#translations tr.preview').each(function () {
				if (jQuery(this).find('td').length < 5) {
					gd_add_column_buttons(this);
				}
			});
}

function gd_add_column_buttons( tr_preview ) {
	const td_buttons = document.createElement( 'TD' );
	tr_preview.append(td_buttons);
	if (tr_preview.nextElementSibling != null) {
		tr_preview.nextElementSibling.querySelectorAll('.status-actions button.approve,.status-actions button.reject,.status-actions button.fuzzy').forEach((button) => {
			button.removeAttribute('tabindex');
			const clone_button = button.cloneNode(true);
			clone_button.classList.add('gd-button');
			clone_button.addEventListener('click', (e) => {
				const button = ('BUTTON' === e.target.parentElement.nodeName) ? e.target.parentElement : e.target;
				if (!button) { return; }
				const strong = button.querySelector('strong');
				button.disabled = true;
				button.style.color = '#afafaf';
				if (strong) {
					strong.classList.add('gd-btn-action');
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
			if ( clone_button.classList.contains( 'approve' ) ) {
				clone_button.title = 'Approve';
			}
			if ( clone_button.classList.contains( 'reject' ) ) {
				clone_button.title = 'Reject';
			}
			if ( clone_button.classList.contains( 'fuzzy' ) ) {
				clone_button.title = 'Set to fuzzy';
			}
			td_buttons.append( clone_button );
		}
	} );
	}
}
