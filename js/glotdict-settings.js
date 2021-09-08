jQuery( '#menu-headline-nav' ).append( '<li class="current-menu-item gd_setting" style="cursor:pointer;"><a style="font-weight:bold;"> GlotDict</a></li>' );
jQuery( '.gd_icon' ).prependTo( '.gd_setting' ).show();

jQuery( '.gd_setting' ).click( () => {
	gd_generate_settings_panel();
} );

jQuery( '.gp-content' ).on( 'click', '.gd_settings_panel input[type="checkbox"]', function() {
	localStorage.setItem( jQuery( this ).attr( 'id' ), jQuery( this ).is( ':checked' ) );
} );

function gd_generate_settings_panel() {
	const gd_settings_panel = document.querySelector( '.gd_settings_panel' );
	if ( null !== gd_settings_panel ) {
		gd_settings_panel.style.display = ( 'none' === gd_settings_panel.style.display ) ? '' : 'none';
		return;
	}

	// Use [[[ code ]]] markdown for symbols and add * at the end of the setting's description if needed.
	const settings_data = [
		{
			'title':    'Hide warnings for:',
			'settings': {
				'no_glossary_term_check': 'missing glossary terms',
				'no_initial_uppercase':   'missing start capitalization',
				'no_initial_space':       'missing start space',
				'no_trailing_space':      'missing end space',
				'no_final_dot':           'missing end hellip [[[…]]]',
				'no_final_other_dots':    'missing end symbols [[[; . ! : 、。؟ ？]]]',
			},
		},
		{
			'title':    'Show warnings for:',
			'settings': {
				'curly_apostrophe_warning': 'straight single quote [[[\']]]',
				'localized_quote_warning':  'straight double quote [[["]]]',
			},
		},
		{
			'title':    'Others',
			'settings': {
				'no_non_breaking_space':                    'Hide highlights for non-breaking spaces.',
				'autosubmit_bulk_copy_from_original':       'Auto-save after "Copy from Original" bulk action.*',
				'force_autosubmit_bulk_copy_from_original': 'Ignore auto-save warnings after "Copy from Original".*',
			},
		},
	];

	const hotkeys = {
		'Add Glossary definition in the translation area':            'Right click on a Glossary term',
		'Add non-breaking spaces near symbols':                       'Ctrl+Shift+X',
		'Approve':                                                    'Ctrl+Shift+A',
		'Cancel':                                                     'Ctrl+Shift+Z',
		'Copy from original':                                         'Ctrl+Shift+B',
		'Dismiss validation warnings for the current visible editor': 'Ctrl+D',
		'Dismiss all validation warnings':                            'Ctrl+Shift+D',
		'Force suggest or Force save translation':                    'Ctrl+Shift+Enter',
		'Fuzzy':                                                      'Ctrl+Shift+F',
		'Load consistency suggestions':                               'Alt+C',
		'Open next string editor':                                    'Page Down',
		'Open previous string editor':                                'Page Up',
		'Reject':                                                     'Ctrl+Shift+R',
		'Suggest or Save translation':                                'Ctrl+Enter',
	}

	const container = document.createElement( 'DIV' );
	container.classList.add( 'notice', 'gd_settings_panel' );
	container.appendChild( document.createElement( 'H2' ) ).appendChild( document.createTextNode( 'GlotDict Settings' ) );

	const fragment = document.createDocumentFragment();
	const subfragment = document.createDocumentFragment();

	settings_data.forEach( category => {
		fragment.appendChild( document.createElement( 'H3' ) ).appendChild( document.createTextNode( category.title ) );
		Object.entries( category.settings ).forEach( setting => {
			const setting_slug = setting[ 0 ];
			let setting_desc = setting[ 1 ];
			const input = document.createElement( 'INPUT' );
			const label = document.createElement( 'LABEL' );
			input.type = 'checkbox';
			input.id = `gd_${setting_slug}`;
			input.checked = ( 'true' === localStorage.getItem( `gd_${setting_slug}` ) ) ? 'checked' : '';
			label.appendChild( input );
			let asterisk = false;
			if ( '*' === setting_desc.slice( -1 ) ) {
				asterisk = true;
				setting_desc = setting_desc.slice( 0, -1 );
			}
			if ( -1 === setting_desc.indexOf( '[[[' ) ) {
				label.appendChild( document.createTextNode( setting_desc ) );
			} else {
				setting_desc.split( /\[\[\[|\]\]\]/ ).forEach( ( part, part_i ) => {
					! ( part_i % 2 ) && subfragment.appendChild( document.createTextNode( part ) );
					( part_i % 2 ) && subfragment.appendChild( document.createElement( 'CODE' ) ).appendChild( document.createTextNode( part ) );
				} );
				label.appendChild( subfragment );
			}
			if ( asterisk ) {
				const asterisk = document.createElement( 'SPAN' );
				asterisk.classList.add( 'gd_asterisk' );
				asterisk.textContent = '*';
				label.appendChild( asterisk );
			}
			fragment.appendChild( label );
		} );
	} );
	const fieldset = document.createElement( 'FIELDSET' );
	fieldset.appendChild( fragment );
	container.appendChild( fieldset );

	fragment.appendChild( document.createElement( 'TH' ) ).appendChild( document.createTextNode( 'Action' ) );
	fragment.appendChild( document.createElement( 'TH' ) ).appendChild( document.createTextNode( 'Hotkey' ) );
	Object.entries( hotkeys ).forEach( hotkey => {
		const [ key, value ] = hotkey;
		const tr = document.createElement( 'TR' );
		tr.appendChild( document.createElement( 'TD' ) ).appendChild( document.createTextNode( `${key}` ) );
		tr.appendChild( document.createElement( 'TD' ) ).appendChild( document.createTextNode( `${value}` ) );
		fragment.appendChild( tr );
	} );
	const table = document.createElement( 'TABLE' );
	table.appendChild( fragment );
	container.appendChild( table );

	const grammarly = document.createElement( 'A' );
	grammarly.target = '_blank';
	grammarly.rel = 'noreferrer noopener';
	const languagetool = grammarly.cloneNode( true );
	const issues = grammarly.cloneNode( true );
	const donate = grammarly.cloneNode( true );
	grammarly.href = 'https://www.grammarly.com/';
	grammarly.textContent = 'Grammarly';
	languagetool.href = 'https://languagetool.org/';
	languagetool.textContent = 'LanguageTool.';
	issues.href = 'https://github.com/Mte90/GlotDict/issues';
	issues.textContent = 'Ask here.';
	donate.href = 'https://www.paypal.me/mte90';
	donate.textContent = 'donate here.';

	const question1 = document.createElement( 'P' );
	const question2 = question1.cloneNode( true );
	const question3 = question1.cloneNode( true );
	question1.appendChild( document.createTextNode( 'Are you looking for spell checking? Try ' ) );
	question1.appendChild( grammarly );
	question1.appendChild( document.createTextNode( ' or ' ) );
	question1.appendChild( languagetool );
	fragment.appendChild( question1 );
	question2.appendChild( document.createTextNode( 'Do you like this browser extension? You can ' ) );
	question2.appendChild( donate );
	fragment.appendChild( question2 );
	question3.appendChild( document.createTextNode( 'Do you want a new feature or settings? ' ) );
	question3.appendChild( issues );
	fragment.appendChild( question3 );
	const caution_note = document.createElement( 'SPAN' );
	const asterisk = caution_note.cloneNode( true );
	asterisk.textContent = '*';
	asterisk.className = 'gd_asterisk';
	caution_note.append( asterisk, 'Use with caution!' );
	fragment.appendChild( caution_note );

	const questions = document.createElement( 'DIV' );
	questions.classList.add( 'gd_settings_questions' );
	container.appendChild( questions ).appendChild( fragment );

	document.querySelector( '.gp-content' ).prepend( container );
}

function gd_get_setting( key ) {
	key = `gd_${key}`;
	if ( null === localStorage.getItem( key ) || 'false' === localStorage.getItem( key ) ) {
		return false;
	}
	return true;
}
