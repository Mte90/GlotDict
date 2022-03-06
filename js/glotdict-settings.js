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
				'autocopy_string_on_translation_opened':    'Auto-copy original to clipboard on editor opening.',
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
		'Load all consistency suggestions':                           'Alt+C',
		'Open next string editor':                                    'Page Down',
		'Open previous string editor':                                'Page Up',
		'Reject':                                                     'Ctrl+Shift+R',
		'Suggest or Save translation':                                'Ctrl+Enter',
	};

	const container = document.createElement( 'DIV' );
	container.classList.add( 'gd_settings' );

	const input1 = document.createElement( 'INPUT' );
	input1.classList.add( 'gd_settings__radio' );
	input1.type = 'radio';
	input1.name = 'group';

	const input2 = input1.cloneNode( true );
	const input3 = input1.cloneNode( true );
	input1.id = 'gd_settings__radio1';
	input1.checked = 'checked';
	input2.id = 'gd_settings__radio2';
	input3.id = 'gd_settings__radio3';

	container.append( input1, input2, input3 );

	const tabs = document.createElement( 'DIV' );
	tabs.classList.add( 'gd_settings_tabs' );
	const tab1 = document.createElement( 'LABEL' );
	tab1.classList.add( 'gd_settings_tab' );
	const tab2 = tab1.cloneNode( true );
	const tab3 = tab1.cloneNode( true );
	tab1.id = 'gd_settings_tab1';
	tab1.htmlFor = 'gd_settings__radio1';
	tab1.textContent = 'GlotDict Settings';
	tab2.id = 'gd_settings_tab2';
	tab2.htmlFor = 'gd_settings__radio2';
	tab2.textContent = 'install' === gd_extension.reason ? 'Welcome' : 'What’s New?';
	tab3.id = 'gd_settings_tab3';
	tab3.htmlFor = 'gd_settings__radio3';
	tab3.textContent = 'GTE Tools';
	container.appendChild( tabs ).append( tab1, tab2, tab3 );

	const panels = document.createElement( 'DIV' );
	panels.classList.add( 'gd_settings_panels' );
	const panel1 = document.createElement( 'DIV' );
	panel1.classList.add( 'gd_settings_panel' );
	const panel2 = panel1.cloneNode( true );
	const panel3 = panel1.cloneNode( true );
	panel1.id = 'gd_settings_panel1';
	panel2.id = 'gd_settings_panel2';
	panel3.id = 'gd_settings_panel3';
	panels.append( panel1, panel2, panel3 );
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
	caution_note.style.margin = '1em 0 .2em';
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
	const currentVersion = '0' === gd_extension.currentVersion ? '' : gd_extension.currentVersion;
	const panel2Title = 'install' === gd_extension.reason ? `Welcome to GlotDict ${currentVersion}!` : `What’s new in GlotDict ${currentVersion}?`;
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
		const link = document.createElement( 'A' );
		link.href = 'https://github.com/Mte90/GlotDict/blob/master/CHANGELOG.md';
		link.textContent = 'Check the Changelog!';
		changelog.appendChild( document.createElement( 'DIV' ) ).appendChild( document.createTextNode( gd_extension.changelog ) );
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

	gd_user.is_connected && gd_user.is_gte && gd_set_panel3_settings( panel3 );

	document.querySelector( '.gp-content' ).prepend( container );
}

function gd_get_setting( key ) {
	key = `gd_${key}`;
	if ( null === localStorage.getItem( key ) || 'false' === localStorage.getItem( key ) ) {
		return false;
	}
	return true;
}

/**
 * Add GTE Tools panel3 to settings
 *
 * @returns void
 * @param panel3 Target div element for 3rd panel
 */
function gd_set_panel3_settings( panel3 ) {
	const fragment3 = document.createDocumentFragment();
	fragment3.appendChild( document.createElement( 'H3' ) ).appendChild( document.createTextNode( 'Locale-specific settings' ) );
	fragment3.appendChild( document.createElement( 'P' ) ).appendChild( document.createTextNode( 'As a GTE, you can customize some GlotDict settings for all users in your locale. First step is to have a global glossary.' ) );
	const styleGuide = document.createElement( 'DIV' );
	fragment3.appendChild( styleGuide );
	styleGuide.classList.add( 'gd-settings-tab3__style-guide' );
	styleGuide.appendChild( document.createElement( 'H4' ) ).appendChild( document.createTextNode( 'Style guide link' ) );
	styleGuide.appendChild( document.createElement( 'P' ) ).appendChild( document.createTextNode( 'GlotDict add 2 links in filters toolbar: Global glossary link, and Style guide link.' ) );
	styleGuide.appendChild( document.createElement( 'P' ) ).appendChild( document.createTextNode( 'If you don\'t already have a global glossary for your locale, we recommend that you create one. Style guide link points to the locale handbook. If you don\'t have one, we also advise you to create one. But maybe you would prefer this link to point to a sub-page of the handbook that describes the style rules, or even an external page like a google doc or a github page… well that\'s possible. We are going to use the description field of the glossary for this.' ) );
	styleGuide.appendChild( document.createElement( 'P' ) ).appendChild( document.createTextNode( 'Fill in the following values, then click on the button which will generate an HTML code that you must copy and paste into the Description field of the glossary. And voilà !' ) );
	const styleGuideForm = document.createDocumentFragment();

	const styleGuideURLLabel = document.createElement( 'LABEL' );
	styleGuideURLLabel.htmlFor = 'gd-styleguide-url';
	styleGuideURLLabel.classList.add( 'gd-settings-label' );
	styleGuideURLLabel.textContent = 'Enter an URL for the style guide link';

	const styleGuideURLInput = document.createElement( 'INPUT' );
	styleGuideURLInput.type = 'url';
	styleGuideURLInput.size = 100;
	styleGuideURLInput.name = 'gd-styleguide-url';
	styleGuideURLInput.id = 'gd-styleguide-url';
	styleGuideURLInput.placeholder = 'https://en-gb.wordpress.org/translations/';

	const styleGuideTextLabel = document.createElement( 'LABEL' );
	styleGuideTextLabel.htmlFor = 'gd-styleguide-text';
	styleGuideTextLabel.classList.add( 'gd-settings-label' );
	styleGuideTextLabel.textContent = 'Enter a text for the style guide link on glossary page';

	const styleGuideTextInput = document.createElement( 'INPUT' );
	styleGuideTextInput.type = 'text';
	styleGuideTextInput.size = 60;
	styleGuideTextInput.name = 'gd-styleguide-text';
	styleGuideTextInput.id = 'gd-styleguide-text';
	styleGuideTextInput.placeholder = 'typographical rules used for the translation of WordPress in UK English';

	const styleGuideMenuLabel = document.createElement( 'LABEL' );
	styleGuideMenuLabel.htmlFor = 'gd-styleguide-menu';
	styleGuideMenuLabel.classList.add( 'gd-settings-label' );
	styleGuideMenuLabel.textContent = 'Enter a title for the style guide link menu on translations pages';

	const styleGuideMenuInput = document.createElement( 'INPUT' );
	styleGuideMenuInput.type = 'text';
	styleGuideMenuInput.size = 30;
	styleGuideMenuInput.name = 'gd-styleguide-menu';
	styleGuideMenuInput.id = 'gd-styleguide-menu';
	styleGuideMenuInput.placeholder = 'Style guide';

	const styleGuideGeneratorButton = document.createElement( 'BUTTON' );
	styleGuideGeneratorButton.id = 'gd-styleguide-btn';
	styleGuideGeneratorButton.type = 'button';
	styleGuideGeneratorButton.style.margin = '10px 0';
	styleGuideGeneratorButton.textContent = 'Generate HTML';

	const styleGuideHTMLCode = document.createElement( 'TEXTAREA' );
	styleGuideHTMLCode.id = 'gd-styleguide-html';
	styleGuideHTMLCode.rows = 5;
	styleGuideHTMLCode.cols = 33;

	styleGuideForm.append( styleGuideURLLabel, styleGuideURLInput, styleGuideTextLabel, styleGuideTextInput, styleGuideMenuLabel, styleGuideMenuInput, styleGuideGeneratorButton, styleGuideHTMLCode );
	fragment3.appendChild( styleGuideForm );
	panel3.appendChild( fragment3 );

	styleGuideGeneratorButton.addEventListener( 'click', () => {
		styleGuideURLInput.style.border = '' === styleGuideURLInput.value ? 'red 1px solid' : 'green 1px solid';
		styleGuideTextInput.style.border = '' === styleGuideTextInput.value ? 'red 1px solid' : 'green 1px solid';
		styleGuideMenuInput.style.border = '' === styleGuideMenuInput.value ? 'red 1px solid' : 'green 1px solid';
		if ( '' === styleGuideURLInput.value || '' === styleGuideTextInput.value || '' === styleGuideMenuInput.value ) {
			return;
		}
		styleGuideHTMLCode.value = `<a href="${styleGuideURLInput.value}" id="gd-guide-link" data-title="${styleGuideMenuInput.value}">${styleGuideTextInput.value}</a>`;
	} );
}
