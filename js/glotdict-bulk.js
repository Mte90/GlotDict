
jQuery('.bulk-action').append(jQuery('<option>', {
  value: 'copy-from-original',
  text: 'Copy From Original'
}));

jQuery('.bulk-actions').on('click', '.button', function(e) {
  if (jQuery('.bulk-action option:selected').val() === 'copy-from-original') {
      jQuery('th.checkbox input:checked').each(function() {

      // List of selectors to ignore
      var ignoreList = [
        // any valid selector
        '.context'
      ];
      var parent = jQuery(this).closest('tr');
      
      // Copy element which will be modified
      var workingElement = parent.find('.original').clone();
        
      // Remove all the elements we don't need
      workingElement.find(ignoreList.join()).remove();
      var text = workingElement.text().trim();
      var row = parent.attr('row');
      jQuery('#editor-' + row + ' textarea').val(text);
    });
    e.preventDefault();
    return false;
  }
});

