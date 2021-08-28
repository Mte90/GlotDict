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

	const settings = {
		'no_final_dot':                             'Don’t validate strings ending with “...“, “.”, “:”',
		'no_final_other_dots':                      'Don’t validate strings ending with ;.!:、。؟？！',
		'no_initial_uppercase':                     'Don’t show a warning when the translation doesn\'t contain an initial uppercase letter when the original string starts with one.',
		'no_glossary_term_check':                   'Don’t show a warning when the translation is missing a glossary term.',
		'no_non_breaking_space':                    'Don’t visualize non-breaking-spaces in preview.',
		'no_initial_space':                         'Hide warning for initial space in translation.',
		'no_trailing_space':                        'Hide warning for trailing space in translation.',
		'curly_apostrophe_warning':                 'Show a warning for missing curly apostrophe in preview.',
		'localized_quote_warning':                  'Show a warning for using non-typographic quotes in preview (except for HTML attributes quotes).',
		'autosubmit_bulk_copy_from_original':       'Auto-submit the "Copy From Original" Bulk Action (Warning: When enabled will submit all originals).',
		'force_autosubmit_bulk_copy_from_original': 'Don’t validate strings during "Copy From Original" Bulk Action to bypass validation. (Warning: When enabled will submit originals with Glossary terms or other warnings.)',
	};

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
	Object.entries( settings ).forEach( setting => {
		const [ key, value ] = setting;
		const input = document.createElement( 'INPUT' );
		const label = document.createElement( 'LABEL' );
		input.type = 'checkbox';
		input.id = `gd_${key}`;
		input.checked = ( 'true' === localStorage.getItem( `gd_${key}` ) ) ? 'checked' : '';
		label.appendChild( input );
		label.appendChild( document.createTextNode( `${value}` ) );
		fragment.appendChild( label );
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
	question2.appendChild( document.createTextNode( 'Do you want a new feature or settings? ' ) );
	question2.appendChild( issues );
	fragment.appendChild( question2 );
	question3.appendChild( document.createTextNode( 'Do you like this browser extension? You can ' ) );
	question3.appendChild( donate );
	fragment.appendChild( question3 );

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
