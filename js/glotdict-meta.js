function gd_add_meta() {
  jQuery('#translations tr.editor').each(function() {
    gd_add_string_counts(this);
  } );
}

function gd_add_string_counts(row) {
    if ( jQuery('.meta .gd-counts', row).length ) {
      jQuery('.meta .gd-counts', row).remove();
    }
    if ( jQuery('.original', row).length ) {
        jQuery('.meta dl:last-of-type', row).before('<div class="gd-counts" style="margin-top: 20px;"></div>');

        if ( jQuery('.original', row).length > 1 ) {
            // Plurals
            jQuery('.original', row).each( function() {
                var parts = jQuery(this).parent().text().split(':');
                var type = parts[0];
                gd_add_count( row, jQuery(this), 'original-count', type + ' String');
            });
            if ( jQuery('.textareas', row).length > 2 ) {
                // Multi-Plural
                jQuery('.textareas', row).each(function(index) {
                    gd_add_plural_definition(row, index, 'plural-heading');
                    if ( jQuery(this).find('.translation').text().trim().length ) {
                        gd_add_count(row, jQuery(this).find('.translation'), 'translated-count-'+index, 'Translated String');
                    }

                    gd_add_count(row, jQuery(this).find('textarea.foreign-text'), 'current-count-'+index, 'Current String');

                    jQuery(this).on("change keyup paste focus", 'textarea.foreign-text', function() {
                        gd_update_count(row, jQuery(this), 'current-count-'+index, true);
                    });                    
                });
            } else {
                // Singular + Plural
                jQuery('.textareas', row).each(function(index) {
                    var prefix = 'Singular ';
                    if ( index > 0 ) prefix = 'Plural ';
                    if ( jQuery(this).find('.translation').text().trim().length ) {
                        gd_add_count(row, jQuery(this).find('.translation'), 'translated-count-'+index, prefix + 'Translated');
                    }

                    gd_add_count(row, jQuery(this).find('textarea.foreign-text'), 'current-count-'+index, prefix + 'Current');

                    jQuery(this).on("change keyup paste focus", 'textarea.foreign-text', function() {
                        gd_update_count(row, jQuery(this), 'current-count-'+index, true);
                    });                    
                });
            }

        } else {
            // Singular
            gd_add_count(row, jQuery('.original', row), 'original-count', 'Original String');
            if ( jQuery('.translation', row).text().trim().length ) {
                gd_add_count(row, jQuery('.translation', row), 'translated-count', 'Translated String');
            }

            gd_add_count(row, jQuery('.textareas textarea.foreign-text', row), 'current-count', 'Current String');

            jQuery(row).on("change keyup paste focus", '.textareas textarea.foreign-text', function() {
                gd_update_count(row, jQuery(this), 'current-count', true);
            });
        }
    }
}

function gd_add_count(row, element, countclass, label, textarea = false) {
    var string = '';
    if (textarea) {
        string = element.val();
    } else {
        string = element.text();        
    }
    var characterCount = string.length;
    var wordCount = 0;
    if (characterCount > 0) {
        if ( string.indexOf(' ') !== -1 ) {
            var words = string.split(' ');
            wordCount = words.length;            
        } else {
            wordCount = 1;
        }
    }
    jQuery('.gd-counts', row).append('<dl class="' + countclass + '"><dt>' + label + ':</dt><dd><span class="characters">' + characterCount + ' Characters</span> (<span class="words">' + wordCount + ' Words</span>)</dl>');
}

function gd_update_count(row, element, countclass, textarea = false) {
    var string = '';
    if (textarea) {
        string = element.val();
    } else {
        string = element.text();        
    }
    var characterCount = string.length;
    var wordCount = 0;
    if (characterCount > 0) {
        if ( string.indexOf(' ') !== -1 ) {
            var words = string.split(' ');
            wordCount = words.length;            
        } else {
            wordCount = 1;
        }
    }
    jQuery('.gd-counts .' + countclass + ' dd .characters', row).text(characterCount + ' Characters');
    jQuery('.gd-counts .' + countclass + ' dd .words', row).text(wordCount + ' Words');
}

function gd_add_plural_definition(row, index, pluralclass) {
    var definition = jQuery('.translation-form-list button[data-plural-index="' + index + '"]', row).attr('aria-label');
    jQuery('.gd-counts', row).append('<dl class="' + pluralclass + '" style="margin-top: 20px;"><dt>Plural:</dt><dd>' + definition + '</dl>');
}
