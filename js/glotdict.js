'use strict';

var glotdict_version = '1.0.1';

gd_add_layover();

gd_current_locale_first();

window.gd_filter_bar = jQuery('.filter-toolbar form div:first');

if (jQuery('.filters-toolbar.bulk-actions:last div:first').length > 0 ) {
  window.gd_filter_bar = jQuery('.filters-toolbar.bulk-actions:last div:first');
}

if (window.gd_filter_bar.length > 0) {

  gd_hotkeys();
  // Fix for PTE align
  if (jQuery('#bulk-actions-toolbar-top').length > 0) {
    jQuery('#upper-filters-toolbar').css('clear', 'both');
    gd_add_column();
    if (jQuery('#bulk-actions-toolbar-bottom').length === 0) {
      jQuery('#bulk-actions-toolbar-top').clone().css('float', 'none').insertBefore('#legend');
      jQuery('form.filters-toolbar.bulk-actions').submit(function() {
        var row_ids = jQuery('input:checked', jQuery('table#translations th.checkbox')).map(function() {
          return jQuery(this).parents('tr.preview').attr('row');
        }).get().join(',');
        jQuery('input[name="bulk[row-ids]"]', jQuery(this)).val(row_ids);
      });
    }
  }
  if (jQuery('.preview').length === 1) {
    jQuery('.preview .action').trigger('click');
  }

  jQuery("<div class='box has-glotdict'></div><div>Contains a Glossary term</div>").appendTo('#legend');
  jQuery("<div class='box has-old-string'></div><div>The translation is at least 6 months old</div>").appendTo('#legend');
  jQuery("<div class='box has-original-copy'></div><div>Contains the Original Copy</div>").appendTo('#legend');

  jQuery('.glossary-word').each(function() {
    var $this = jQuery(this);
    var line = $this.parents().eq(7).attr('row');
    jQuery('#preview-' + line).addClass('has-glotdict');
    $this.wrap('<a href="https://translate.wordpress.org/consistency?search=' + $this.text() + '&amp;set=' + gd_get_lang_consistency() + '%2Fdefault" target="_blank" rel="noreferrer noopener"></a>');
  });

  gd_mark_old_strings();

  gd_locales_selector();

  jQuery($gp.editor.table).onFirst('click', 'button.translation-actions__save:not(.forcesubmit)', gd_validate_visible);
}

gd_add_project_links();
gd_add_review_button();
gd_add_scroll_buttons();
gd_add_meta();

jQuery('.glotdict_language').change(function() {
  localStorage.setItem('gd_language', jQuery('.glotdict_language option:selected').text());
  localStorage.setItem('gd_glossary_date', '');
  gd_locales();
  location.reload();
});

jQuery('.glossary-word').contextmenu(function(e) {
  var info = jQuery(this).data('translations');
  jQuery('.editor:visible textarea').val(jQuery('.editor:visible textarea').val() + info[0].translation);
  e.preventDefault();
  return false;
});

jQuery('.gp-content').on('click', '.discard-glotdict', function(e) {
  var $this = jQuery(this);
  var row = $this.data('row');
  jQuery('#editor-' + row).data('discard', 'true');
  $this.parent().remove();
  if (jQuery('#editor-' + row + ' .gd-warning').length === 0) {
    jQuery.removeData('#editor-' + row, 'discard');
  }
  if (jQuery('#editor-' + row + ' .warning').length === 0) {
    jQuery('#editor-' + row).removeClass('has-warnings').addClass('no-warnings');
    jQuery('#preview-' + row).removeClass('has-warnings').addClass('no-warnings');
  }
  e.preventDefault();
  return false;
});

jQuery('.gp-content').on('click', '.gd-review:not(.gd-review-done)', function(e) {
  jQuery(this).val('Review in progress');
  gd_run_review();
  jQuery(this).val('Review Complete').removeClass('gd-review').addClass('gd-review-done').attr('disabled', 'disabled');
});

gd_selected_count();

gd_non_breaking_space_highlight();

gd_curly_apostrophe_highlight();

gd_wait_table_alter();

gd_remove_layover();

if (jQuery('.gp-content #upper-filters-toolbar').length > 0) {
  jQuery('.gp-content').css('max-width', '85%');
}
