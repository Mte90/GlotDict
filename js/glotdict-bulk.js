
jQuery('.bulk-action').append(jQuery('<option>', {
  value: 'copy-from-original',
  text: 'Copy From Original'
}));

jQuery('.bulk-actions').on('click', '.button', function(e) {
  if (jQuery('.bulk-action option:selected').val() === 'copy-from-original') {
    var copied_count = 0;
    $gp.editor.hide(); // Avoid validation on open editors that are empty.
    jQuery('th.checkbox input:checked').each(function() {
      var parent = jQuery(this);
      parent = parent.parent().parent();
      var text = parent.find('.original').text().trim();
      var row = parent.attr('row');
      jQuery('#editor-' + row + ' textarea').val(text);
      jQuery('#preview-' + row).addClass('has-original-copy');
      if (gd_get_setting('autosubmit_bulk_copy_from_original')) {
        jQuery('#editor-' + row + ' button.ok').trigger('click');
      } else {
        copied_count++;
      }
    });
    if ( copied_count ) {
      jQuery('#gd-copied-count').remove();
      jQuery('#translations').before('<div id="gd-copied-count" class="notice copied">' + copied_count + ( copied_count > 1 ? ' originals have ' : ' original has ' ) + 'been copied.</div>');
    }
    e.preventDefault();
    return false;
  }
});

