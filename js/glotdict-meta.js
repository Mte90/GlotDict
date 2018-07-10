function gd_add_meta() {
  jQuery('#translations tr.editor').each(function() { 
    gd_add_string_counts(this);
  } );
}

function gd_add_string_counts(row) {
    if ( jQuery(row).find('.meta .gd-counts').length ) {
      jQuery(row).find('.meta .gd-counts').remove();
    }
    jQuery(row).find('.meta').append('<div class="gd-counts"><h3>String Counts</h3></div>');

    gd_add_original_count(row);

    if ( jQuery(row).find('.translation').length ) {
      gd_add_translation_count(row);
    }

    gd_add_current_count(row);

    jQuery(row).on("change keyup paste", '.textareas textarea.foreign-text', function() {
      gd_update_current_count(row, this);
    });
}

function gd_add_original_count(row) {
    var originalCharacterCount = jQuery(row).find('.original').text().length;
    var originalWords = jQuery(row).find('.original').text().split(' ');
    var originalWordCount = originalWords.length;
    jQuery(row).find('.gd-counts').append('<dl class="original-count"><dt>Original:</dt><dd><abbr title="' + originalWordCount + ' Words">' + originalCharacterCount + ' Characters</abbr></dd></dl>');
}

function gd_add_translation_count(row) {
    var translationCharacterCount = jQuery(row).find('.translation').text().length;
    var translationWords = jQuery(row).find('.original').text().split(' ');
    var translationWordCount = translationWords.length;
    jQuery(row).find('.gd-counts').append('<dl class="translated-count"><dt>Translated</dt><dd><abbr title="' + translationWordCount + ' Words">' + translationCharacterCount + ' Characters</abbr></dd></dl>'); 
}

function gd_add_current_count(row) {
    var currentCharacterCount = jQuery(row).find('.textareas textarea.foreign-text').val().length;
    var currentWords = jQuery(row).find('.textareas textarea.foreign-text').val().split(' ');
    var currentWordCount = currentWords.length;
    jQuery(row).find('.gd-counts').append('<dl class="current-count"><dt>Current</dt><dd><abbr title="' + currentWordCount + ' Words">' + currentCharacterCount + ' Characters</abbr></dd></dl>');
}

function gd_update_current_count(row, textarea) {
    var currentCharacterCount = jQuery(textarea).val().length;
    var currentWords = jQuery(row).find('.textareas textarea.foreign-text').val().split(' ');
    var currentWordCount = currentWords.length;
    jQuery(row).find('.gd-counts .current-count dd abbr').text(currentCharacterCount + ' Characters');
    jQuery(row).find('.gd-counts .current-count dd abbr').attr('title', currentWordCount + ' Words');
}