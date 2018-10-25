/* Add Currently Selected Count */
jQuery(document).on('click', '.checkbox :checkbox', function(e) {
  jQuery('#gd-checked-count').remove();
  var checked_count = jQuery('tbody .checkbox :checkbox:checked').length;
  if ( checked_count > 0 ) {
    var current_selectedcount = 0;
    var waiting_selectedcount = 0;
    var fuzzy_selectedcount = 0;
    var old_selectedcount = 0;
    var rejected_selectedcount = 0;
    var untranslated_selectedcount = 0;
    var nowarnings_selectedcount = 0;
    var warnings_selectedcount = 0;
    var glotdict_selectedcount = 0;
    jQuery('tbody .checkbox :checkbox:checked').each(function(index) {
      var row = jQuery(this).closest('tr.preview');
      if (row.hasClass('status-current')) {
        current_selectedcount++;
      }
      if (row.hasClass('status-waiting')) {
        waiting_selectedcount++;
      }
      if (row.hasClass('status-fuzzy')) {
        fuzzy_selectedcount++;
      }
      if (row.hasClass('status-old')) {
        old_selectedcount++;
      }
      if (row.hasClass('status-rejected')) {
        rejected_selectedcount++;
      }
      if (row.hasClass('untranslated')) {
        untranslated_selectedcount++;
      }
      if (row.hasClass('no-warnings')) {
        nowarnings_selectedcount++;
      }
      if (row.hasClass('has-warnings')) {
        warnings_selectedcount++;
      }
      if (row.hasClass('has-glotdict')) {
        glotdict_selectedcount++;
      }
    });
    var selected_strings_text = [];
    if (current_selectedcount > 0) {
      var current_string_text = current_selectedcount + ' current string';
      if (current_selectedcount > 1) {
        current_string_text += 's';
      }
      selected_strings_text.push(current_string_text);
    }
    if (waiting_selectedcount > 0) {
      var waiting_string_text = waiting_selectedcount + ' waiting string';
      if (waiting_selectedcount > 1) {
        waiting_string_text += 's';
      }
      selected_strings_text.push(waiting_string_text);
    }
    if (fuzzy_selectedcount > 0) {
      var fuzzy_string_text = fuzzy_selectedcount + ' fuzzy string';
      if (fuzzy_selectedcount > 1) {
        fuzzy_string_text += 's';
      }
      selected_strings_text.push(fuzzy_string_text);
    }
    if (old_selectedcount > 0) {
      var old_string_text = old_selectedcount + ' old string';
      if (old_selectedcount > 1) {
        old_string_text += 's';
      }
      selected_strings_text.push(old_string_text);
    }
    if (rejected_selectedcount > 0) {
      var rejected_string_text = rejected_selectedcount + ' rejected string';
      if (rejected_selectedcount > 1) {
        rejected_string_text += 's';
      }
      selected_strings_text.push(rejected_string_text);
    }
    if (untranslated_selectedcount > 0) {
      var untranslated_string_text = untranslated_selectedcount + ' untranslated string';
      if (untranslated_selectedcount > 1) {
        untranslated_string_text += 's';
      }
      selected_strings_text.push(untranslated_string_text);
    }
    if (nowarnings_selectedcount > 0) {
      var nowarnings_string_text = nowarnings_selectedcount + ' string';
      if (nowarnings_selectedcount > 1) {
        nowarnings_string_text += 's';
      }
      nowarnings_string_text += ' with no warnings';
      //selected_strings_text.push(nowarnings_string_text); - Suppressed as unnecessary
    }
    if (warnings_selectedcount > 0) {
      var warnings_string_text = warnings_selectedcount + ' string';
      if (warnings_selectedcount > 1) {
        warnings_string_text += 's';
      }
      warnings_string_text += ' with warnings';
      selected_strings_text.push(warnings_string_text);
    }
    if (glotdict_selectedcount > 0) {
      var glotdict_string_text = glotdict_selectedcount + ' string';
      if (glotdict_selectedcount > 1) {
        glotdict_string_text += 's';
      }
      glotdict_string_text += ' with Glossary terms';
      selected_strings_text.push(glotdict_string_text);
    }
    jQuery('#translations').before('<div id="gd-checked-count" class="notice">' + checked_count + ( checked_count > 1 ? ' rows are ' : ' row is ' ) + ' selected.</div>');
    if (Array.isArray(selected_strings_text) && selected_strings_text.length > 0) {
      jQuery('#gd-checked-count').append(' (' + selected_strings_text.join(', ') + '.)');
    }
  }
});

/* Attach to ajaxSuccess to track Approve/Reject/Fuzzy Status Setting */
var approved_count = 0;
var rejected_count = 0;
var fuzzied_count = 0;
var submitted_count = 0;
jQuery(document).ajaxSuccess(function(event, xhr, settings) {
  if ( settings.url === $gp_editor_options.set_status_url ) {
    var pairs = settings.data.split('&');
    var data = [];
    for ( var i = 0; i < pairs.length; i++ ) {
      var pair = pairs[i].split('=');
      data[pair[0]] = pair[1];
    }
    switch (data['status']) {
      case 'current':
        jQuery('#gd-approved-count').remove();
        approved_count++;
        jQuery('#translations').before('<div id="gd-approved-count" class="notice approved">' + approved_count + ( approved_count > 1 ? ' translations have ' : ' translation has ' ) + 'been approved.</div>');
        break;
      case 'rejected':
        jQuery('#gd-rejected-count').remove();
        rejected_count++;
        jQuery('#translations').before('<div id="gd-rejected-count" class="notice rejected">' + rejected_count + ( rejected_count > 1 ? ' translations have ' : ' translation has ' ) + 'been rejected.</div>');
        break;
      case 'fuzzy':
        jQuery('#gd-fuzzied-count').remove();
        fuzzied_count++;
        jQuery('#translations').before('<div id="gd-fuzzied-count" class="notice fuzzied">' + fuzzied_count + ( fuzzied_count > 1 ? ' translations have ' : ' translation has ' ) + 'been fuzzied.</div>');
        break;
    }
  } else if ( settings.url === $gp_editor_options.url ) {
    jQuery('#gd-submitted-count').remove();
    submitted_count++;
    jQuery('#translations').before('<div id="gd-submitted-count" class="notice submitted">' + submitted_count + ( submitted_count > 1 ? ' translations have ' : ' translation has ' ) + 'been submitted.</div>');
  }
});