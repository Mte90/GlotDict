function gd_add_meta() {
  jQuery('#translations tr.editor').each(function() {
    gd_add_string_counts(this);
  } );
}

function gd_add_string_counts(row) {
    if ( jQuery(row).find('.meta .gd-counts').length ) {
      jQuery(row).find('.meta .gd-counts').remove();
    }
    jQuery(row).find('.meta dl:last-of-type').before('<div class="gd-counts"></div>');

    gd_add_count(row, '.original', 'original-count', 'Original String');
    if ( jQuery(row).find('.translation').text().trim().length ) {
        gd_add_count(row, '.translation', 'translated-count', 'Translated String');
    }

    gd_add_count(row, '.textareas textarea.foreign-text', 'current-count', 'Current String');

    jQuery(row).on("change keyup paste", '.textareas textarea.foreign-text', function() {
        gd_update_count(row, jQuery(this), 'current-count', true);
    });
}

function gd_add_count(row, selector, countclass, label, textarea = false) {
    var element = jQuery(row).find(selector);
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
    jQuery(row).find('.gd-counts').append('<dl class="' + countclass + '"><dt>' + label + ':</dt><dd><span class="characters">' + characterCount + ' Characters</span> (<span class="words">' + wordCount + ' Words</span>)</dl>');
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
    jQuery(row).find('.gd-counts .' + countclass + ' dd .characters').text(characterCount + ' Characters');
    jQuery(row).find('.gd-counts .' + countclass + ' dd .words').text(wordCount + ' Words');
}
