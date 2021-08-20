jQuery('#menu-headline-nav').append('<li class="current-menu-item gd_setting" style="cursor:pointer;"><a style="font-weight:bold;"> GlotDict</a></li>');
jQuery('.gd_icon').prependTo('.gd_setting').show();

jQuery('.gd_setting').click(function() {
  gd_generate_settings_panel();
});

jQuery('.gp-content').on('click', '.gd_settings_panel .gd_setting_check', function() {
  localStorage.setItem(jQuery(this).attr('id'), jQuery(this).is(':checked'));
});

function gd_generate_settings_panel() {
  if (jQuery('.gd_settings_panel').length !== 0) {
    jQuery('.gd_settings_panel').toggle();
    return;
  }
  var settings = {
    'no_final_dot': 'Don’t validate strings ending with “...“, “.”, “:”',
    'no_final_other_dots': 'Don’t validate strings ending with ;.!:、。؟？！',
    'no_initial_uppercase': 'Don’t show a warning when the translation doesn\'t contain an initial uppercase letter when the original string starts with one.',
    'no_glossary_term_check': 'Don’t show a warning when the translation is missing a glossary term.',
    'no_non_breaking_space': 'Don’t visualize non-breaking-spaces in preview.',
    'no_initial_space': 'Hide warning for initial space in translation.',
    'no_trailing_space': 'Hide warning for trailing space in translation.',
    'curly_apostrophe_warning': 'Show a warning for missing curly apostrophe in preview.',
    'localized_quote_warning': 'Show a warning for using non-typographic quotes in preview (except for HTML attributes quotes).',
    'autosubmit_bulk_copy_from_original': 'Auto-submit the "Copy From Original" Bulk Action (Warning: When enabled will submit all originals).',
    'force_autosubmit_bulk_copy_from_original': 'Don’t validate strings during "Copy From Original" Bulk Action to bypass validation. (Warning: When enabled will submit originals with Glossary terms or other warnings.)'
  };
  var container = '<div class="notice gd_settings_panel"><h2>GlotDict Settings</h2></div>';
  jQuery('.gp-content').prepend(container);
  var hotkeys = '<div class="gd-row"><div><h3>Hotkey</h3></div><div><h3>Action</h3></div></div>' +
  '<div class="gd-row"><div>Ctrl+Enter</div><div>Suggest or Save translation</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+Enter</div><div>Force suggest or Force save translation</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+A</div><div>Approve</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+R</div><div>Reject</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+F</div><div>Fuzzy</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+Z</div><div>Cancel</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+B</div><div>Copy from original</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+X</div><div>Add non-breaking spaces near symbols</div></div>' +
  '<div class="gd-row"><div>Right click on a <span class="glossary-word">term</span></div><div>Add Glossary definition in the translation area</div></div>' +
  '<div class="gd-row"><div>Alt+C</div><div>Load consistency suggestions</div></div>' +
  '<div class="gd-row"><div>Ctrl+D</div><div>Dismiss validation warnings for the current visible editor</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+D</div><div>Dismiss all validation warnings</div></div>' +
  '<div class="gd-row"><div>Ctrl+Shift+R</div><div>Reset all GlotDict settings</div></div>' +
  '<div class="gd-row"><div>Page Down</div><div>Open next string editor</div></div>' +
  '<div class="gd-row"><div>Page Up</div><div>Open previous string editor</div></div>' +
  '<br><h3>Settings</h3>';
  jQuery('.gd_settings_panel').append(hotkeys);
  jQuery.each(settings, function(key, value) {
    var checked = '';
    if (localStorage.getItem('gd_' + key) === 'true') {
      checked = 'checked';
    }
    jQuery('.gd_settings_panel').append('<input class="gd_setting_check" type="checkbox" id="gd_' + key + '" ' + checked + '> <label for="gd_' + key + '">' + value + '</label><br>');
  });
  jQuery('.gd_settings_panel').append('<br><h3>Are you looking for spell checking? Try <a href="https://www.grammarly.com/" target="_blank" rel="noreferrer noopener">Grammarly</a> or <a href="https://languagetool.org/" target="_blank" rel="noreferrer noopener">LanguageTool</a>.</h3>');
  jQuery('.gd_settings_panel').append('<h3>Do you want a new feature or settings? Ask <a href="https://github.com/Mte90/GlotDict/issues" target="_blank" rel="noreferrer noopener">here</a>.</h3>');
  jQuery('.gd_settings_panel').append('<h3>Do you like this browser extension? You can donate <a href="https://www.paypal.me/mte90" target="_blank" rel="noreferrer noopener">here</a>.</h3>');
}

function gd_get_setting(key) {
  key = 'gd_' + key;
  if (localStorage.getItem(key) === null || localStorage.getItem(key) === 'false') {
    return false;
  }
  return true;
}
