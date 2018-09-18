/* Add Currently Selected Count */
jQuery(document).on('click', '.checkbox :checkbox', function(e) {
  jQuery('#gd-checked-count').remove();
  var checked_count = jQuery('tbody .checkbox :checkbox:checked').length;
  if ( checked_count > 0 ) {
    jQuery('#translations').before('<div id="gd-checked-count" class="notice">' + checked_count + ( checked_count > 1 ? ' rows are ' : ' row is ' ) + 'currently selected.</div>');
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
