jQuery( '#menu-headline-nav' ).append( '<li class="gd_setting" style="cursor:pointer;"><a> GlotDict</a></li>' );
jQuery( '.gd_icon' ).prependTo( '.gd_setting' ).show();

const gd_settings_menu = document.querySelector( '.gd_setting' );
gd_settings_menu && gd_settings_menu.addEventListener( 'click', () => {
	if ( document.body.classList.contains( 'gd-settings-on-screen' ) && '0' !== gd_extension.previousVersion ) {
		gd_extension.previousVersion = gd_extension.currentVersion;
		localStorage.setItem( 'gd_extension_status', JSON.stringify( gd_extension ) );
	}
	document.body.classList.toggle( 'gd-settings-on-screen' );
	gd_generate_settings_panel();
} );

jQuery( '.gp-content' ).on( 'click', '.gd_settings input[type="checkbox"]', function() {
	localStorage.setItem( jQuery( this ).attr( 'id' ), jQuery( this ).is( ':checked' ) );
} );

function gd_generate_settings_panel() {
	const gd_settings = document.querySelector( '.gd_settings' );
	if ( null !== gd_settings ) {
		gd_settings.style.display = ( 'none' === gd_settings.style.display ) ? '' : 'none';
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
				'no_final_dot':		   'missing end hellip [[[…]]]',
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
				'no_non_breaking_space':				    'Hide highlights for non-breaking spaces.',
				'autocopy_string_on_translation_opened':    'Auto-copy original to clipboard on editor opening.',
				'autosubmit_bulk_copy_from_original':       'Auto-save after "Copy from Original" bulk action.*',
				'force_autosubmit_bulk_copy_from_original': 'Ignore auto-save warnings after "Copy from Original".*',
			},
		},
	];

	const hotkeys = {
		'Add Glossary definition in the translation area':		    'Right click on a Glossary term',
		'Add non-breaking spaces near symbols':				       'Ctrl+Shift+X',
		'Approve':												    'Ctrl+Shift+A',
		'Cancel':												     'Ctrl+Shift+Z',
		'Copy from original':										 'Ctrl+Shift+B',
		'Dismiss validation warnings for the current visible editor': 'Ctrl+D',
		'Dismiss all validation warnings':						    'Ctrl+Shift+D',
		'Force suggest or Force save translation':				    'Ctrl+Shift+Enter',
		'Fuzzy':												      'Ctrl+Shift+F',
		'Load consistency suggestions':						       'Alt+C',
		'Open next string editor':								    'Page Down',
		'Open previous string editor':								'Page Up',
		'Reject':												     'Ctrl+Shift+R',
		'Suggest or Save translation':								'Ctrl+Enter',
	};

	const container = document.createElement( 'DIV' );
	container.classList.add( 'gd_settings' );

	const input1 = document.createElement( 'INPUT' );
	input1.classList.add( 'gd_settings__radio' );
	input1.type = 'radio';
	input1.name = 'group';
	const input2 = input1.cloneNode( true );
	input1.id = 'gd_settings__radio1';
	input1.checked = 'checked';
	input2.id = 'gd_settings__radio2';
	container.append( input1, input2 );

	const tabs = document.createElement( 'DIV' );
	tabs.classList.add( 'gd_settings_tabs' );
	const tab1 = document.createElement( 'LABEL' );
	tab1.classList.add( 'gd_settings_tab' );
	const tab2 = tab1.cloneNode( true );
	tab1.id = 'gd_settings_tab1';
	tab1.htmlFor = 'gd_settings__radio1';
	tab1.textContent = 'GlotDict Settings';
	tab2.id = 'gd_settings_tab2';
	tab2.htmlFor = 'gd_settings__radio2';
	tab2.textContent = 'install' === gd_extension.reason ? 'Welcome' : 'What’s New?';
	container.appendChild( tabs ).append( tab1, tab2 );

	const panels = document.createElement( 'DIV' );
	panels.classList.add( 'gd_settings_panels' );
	const panel1 = document.createElement( 'DIV' );
	panel1.classList.add( 'gd_settings_panel' );
	const panel2 = panel1.cloneNode( true );
	panel1.id = 'gd_settings_panel1';
	panel2.id = 'gd_settings_panel2';
	panels.append( panel1, panel2 );
	container.appendChild( panels );

	const fragment = document.createDocumentFragment();
	const subfragment = document.createDocumentFragment();
	const asterisk = document.createElement( 'SPAN' );
	asterisk.classList.add( 'gd_asterisk' );
	asterisk.textContent = '*';
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
			let has_asterisk = false;
			if ( '*' === setting_desc.slice( -1 ) ) {
				has_asterisk = true;
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
			if ( has_asterisk ) {
				label.appendChild( asterisk.cloneNode( true ) );
			}
			fragment.appendChild( label );
		} );
	} );
	const fieldset = document.createElement( 'FIELDSET' );
	fieldset.appendChild( fragment ) && panel1.appendChild( fieldset );

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
	table.appendChild( fragment ) && panel1.appendChild( table );
	const caution_note = document.createElement( 'SPAN' );
	caution_note.style.fontWeight = 'bold';
	caution_note.append( asterisk, 'Please use features marked like this with caution!' );
	panel1.appendChild( caution_note );

	const changelog = document.createElement( 'DIV' );
	changelog.classList.add( 'gd_changelog' );
	const closeSettings = document.createElement( 'A' );
	closeSettings.classList.add( 'gd-close-settings' );
	closeSettings.textContent = 'Close';
	closeSettings.addEventListener( 'click', () => {
		gd_settings_menu.click();
	} );
	const panel2Title = 'install' === gd_extension.reason ? `Welcome to GlotDict ${gd_extension.currentVersion}!` : `What’s new in GlotDict ${gd_extension.currentVersion}?`;
	changelog.appendChild( document.createElement( 'H3' ) ).appendChild( document.createTextNode( panel2Title ) );
	if ( 'install' === gd_extension.reason ) {
		changelog.appendChild( document.createElement( 'P' ) ).appendChild( document.createTextNode( 'Howdy! Let me tell you a few things before starting translating:' ) );
		const ul = document.createElement( 'UL' );
		const advices = {
			1: 'Choose your locale in the top part of any strings translation page.',
			2: 'Customize GlotDict preferences in the Settings tab.',
			3: 'Try the Review button on any strings translation page.',
		};
		Object.values( advices ).forEach( advice => {
			ul.appendChild( document.createElement( 'LI' ) ).appendChild( document.createTextNode( advice ) );
		} );
		changelog.appendChild( ul );
		changelog.appendChild( document.createElement( 'P' ) ).appendChild( document.createTextNode( 'Enjoy!' ) );
	} else {
		link = document.createElement( 'A' );
		link.href = 'https://github.com/Mte90/GlotDict/blob/master/CHANGELOG.md';
		link.innerHTML = 'Check the Changelog!';
		// Fallback in case the changelog is empty
		if ( gd_extension.changelog === '' ) {
		    gd_extension.changelog = document.createElement( 'SPAN' );
		    container.style.display = 'none';
		} else {
		    gd_extension.changelog = document.createTextNode( gd_extension.changelog );
		}
		changelog.appendChild( document.createElement( 'DIV' ) ).appendChild( gd_extension.changelog );
		changelog.appendChild( link );
	}
	panel2.append( closeSettings, changelog );

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
	question2.appendChild( document.createTextNode( 'Do you like this browser extension? You can ' ) );
	question2.appendChild( donate );
	question3.appendChild( document.createTextNode( 'Do you want a new feature or settings? ' ) );
	question3.appendChild( issues );
	fragment.append( question1, question2, question3 );

	const questions = document.createElement( 'DIV' );
	questions.classList.add( 'gd_settings_questions' );
	panel2.appendChild( questions ).appendChild( fragment );

	document.querySelector( '.gp-content' ).prepend( container );
}

function gd_get_setting( key ) {
	key = `gd_${key}`;
	if ( null === localStorage.getItem( key ) || 'false' === localStorage.getItem( key ) ) {
		return false;
	}
	return true;
}
