
jQuery('.bulk-action').append(jQuery('<option>', {
  value: 'copy-from-original',
  text: 'Copy From Original'
}));

jQuery('.bulk-actions').on('click', '.button', function(e) {
  if (jQuery('.bulk-action option:selected').val() === 'copy-from-original') {
    jQuery('th.checkbox input:checked').each(function() {
      var parent = jQuery(this);
      parent = parent.parent().parent();
      var text = parent.find('.original').text().trim();
      var row = parent.attr('row');
      jQuery('#editor-' + row + ' textarea').val(text);
    });
    e.preventDefault();
    return false;
  }
});

