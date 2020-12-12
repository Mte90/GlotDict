/**
 * Saniitize the value striping html
 * @param {string} value
 * @returns {string} sanitized
 */
function sanitize_value(value) {
  if (typeof value.replace === 'function') {
    return value.replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
  }
  return value;
}

/**
 * Get the today with the format dd/mm/yyyy used for the update daily check
 *
 * @returns String
 */
function gd_today() {
  var today = new Date();
  var todayn = today.getDate();
  if (todayn.length === 1) {
    todayn = '0' + todayn;
  }
  var monthn = today.getMonth() + 1;
  if (monthn.length === 1) {
    monthn = '0' + monthn;
  }
  return todayn + '/' + monthn + '/' + today.getFullYear();
}

/**
 * Get the the list of locales cached
 *
 * @returns Array
 */
function gd_list_locales_cached() {
  var value = localStorage.getItem('gd_locales');
  if (value === '' || value === 'undefined') {
    value = gd_locales();
  } else {
    value = JSON.parse(value);
  }
  if (typeof value === 'string') {
    value = JSON.parse(value);
  }
  return value;
}

/**
 * Get the list of locales avalaible
 *
 * @returns Array
 */
function gd_locales() {
  window.glotdict_locales = ['ast', 'bel', 'bg_BG', 'cy', 'da_DK', 'de_DE', 'en_AU', 'en_CA', 'en_GB', 'es_ES', 'fi', 'fr_FR', 'he_IL', 'hi_IN', 'hr_HR', 'it_IT', 'ja', 'lt_LT', 'lv_LV', 'nl_BE', 'nl_NL', 'pt_BR', 'ro_RO', 'sv_SE', 'th', 'tr_TR', 'uk'];
  var locales_date_cache = localStorage.getItem('gd_locales_date');
  if (locales_date_cache === null || locales_date_cache !== gd_today()) {
    jQuery.ajax({
      url: 'https://codeat.co/glotdict/dictionaries/' + glotdict_version + '.json',
      dataType: 'text',
      cache: false
    }).done(function(data) {
      localStorage.setItem('gd_locales', data);
      window.glotdict_locales = JSON.parse(data);
      localStorage.setItem('gd_locales_date', gd_today());
    });
  }
  if (locales_date_cache !== null) {
    var temp_value = JSON.parse(localStorage.getItem('gd_locales'));
    if (typeof temp_value === 'string') {
      temp_value = JSON.parse(temp_value);
    }
    window.glotdict_locales = Object.keys(temp_value);
  }
  return window.glotdict_locales;
}

/**
 * Get the language saved in GlotDict
 *
 * @returns string
 */
function gd_get_lang() {
  if (typeof window.glotdict_lang === 'undefined') {
    var lang = localStorage.getItem('gd_language');
    if (lang === '' || lang === null) {
      return '';
    }
    window.glotdict_lang = sanitize_value(lang);
  }
  return window.glotdict_lang;
}

/**
 * Add links for Translation global status and Language projects archive
 * @returns void
 */
function gd_add_project_links() {
  if (jQuery('.gp-content .breadcrumb li').length > 3 && jQuery('.gp-content .breadcrumb li:last-child a').length > 0) {
    var lang = jQuery('.gp-content .breadcrumb li:last-child a').attr('href').split('/');
    lang = sanitize_value(lang[lang.length - 3]);
    jQuery('.gp-content').prepend('<a style="float:right" href="https://translate.wordpress.org/locale/' + lang + '/default" target="_blank" rel="noreferrer noopener">' + jQuery('.gp-content .breadcrumb li:last-child a').text() + ' Projects to Translate</a>');
    jQuery(jQuery('.gp-content h2')[0]).prepend('<a class="glossary-link" style="float:right;padding-left:5px;margin-left:5px;border-left: 1px solid black;" href="https://translate.wordpress.org/stats" target="_blank" rel="noreferrer noopener">Translation Global Status</a>');
  }
}

/**
 * Add the review button
 * @returns void
 */
function gd_add_review_button() {
  if (jQuery('body.logged-in').length !== 0) {
    jQuery('.filters-toolbar.bulk-actions:first div:last').append(' <input class="button gd-review" value="Review" type="button">');
  }
}

/**
 * Add the buttons to scroll to the row of the language choosen
 * @returns void
 */
function gd_add_scroll_buttons() {
  var locations = {
    statsRegex: 'https:\\/\\/translate.wordpress.org\\/stats\\/$',
    projectsRegex: 'https:\\/\\/translate.wordpress.org\\/projects\\/[^\\/]+\\/[^\\/]+\\/$',
    appsRegex: 'https:\\/\\/translate.wordpress.org\\/projects\\/apps\\/[^\\/]+\\/[^\\/]+\\/$'
  }

  var locale = gd_get_lang().toLowerCase().replace('_', '-').split('-');
  var slug = (!locale[1] || locale[0] === locale[1]) ? locale[0] : locale[0] + '-' + locale[1];

  for (var regex in locations) {
    var position = document.querySelector('table');
    var acquired = (RegExp(locations[regex])).test(window.location.href);
    if (position && acquired) {
      jQuery(position).before('<button style="float:right;margin-bottom:1em" class="gd_scroll">Scroll to ' + gd_get_lang() + '</button>');

      jQuery('.gd_scroll').on('click', function() {
        var target = document.querySelector('table tr th a[href*="/' + slug + '/"]') || document.querySelector('table td strong a[href*="/' + slug + '/"]');
        if (!target) { return; }
        var row = target.closest('tr');
        if (!row) { return; }
        row.style.border = '2px solid black';
        target.style.color = '#a70505';
        if (!target.textContent.includes('➤')) {
          target.textContent = '➤ ' + target.textContent;
        }
        jQuery('html, body').animate({
          scrollTop: jQuery(row).offset().top - 70
        });
      });
    }
  }
}

/**
 * Print the locales selector
 *
 * @returns void
 */
function gd_locales_selector() {
  var lang = gd_get_lang();
  window.gd_filter_bar.append('<span class="separator">•</span><label for="gd-language-picker">Pick locale: </label><select id="gd-language-picker" class="glotdict_language"></select>');
  jQuery('.glotdict_language').append(jQuery('<option></option>'));
  var gd_locales_array = gd_locales();
  jQuery.each(gd_locales_array, function(key, value) {
    var new_option = jQuery('<option></option>').attr('value', value).text(value);
    if (lang === value) {
      new_option.attr('selected', true);
    }
    jQuery('.glotdict_language').append(new_option);
  });
  if (lang === '' || lang === false) {
    window.gd_filter_bar.append('<h3 style="background-color:#ddd;padding:4px;width:130px;display:inline;margin-left:4px;color:red;">&larr; Set the glossary!</h3>')
      .append('<br><h2 style="background-color:#fff;padding:0;display:block;text-align:center;margin-top: 6px;">Welcome to GlotDict! Discover the features and the hotkeys on the <a href="https://github.com/Mte90/GlotDict/blob/master/README.md#features"  target="_blank" rel="noreferrer noopener">Readme</a>.</h2>');
  }
}

/**
 * Add a border and a legend for old strings (at least 6 months)
 *
 * @returns void
 */
function gd_mark_old_strings() {
  jQuery('tr.preview').each(function() {
    var id = jQuery(this).attr('row');
    var date_timestamp = Date.parse(jQuery('#editor-' + id + ' .meta dd:eq(1)').html().slice(0, -3).trim());
    date_timestamp = new Date(date_timestamp);
    var today = new Date();
    var months = today.getMonth() - date_timestamp.getMonth() + (12 * (today.getFullYear() - date_timestamp.getFullYear()));
    if (months > 6) {
      jQuery(this).addClass('has-old-string');
    }
  });
}

/**
 * Highlight in preview the non-breaking-space
 * https://github.com/GlotPress/GlotPress-WP/issues/801
 *
 * @returns {void}
 */
function gd_non_breaking_space_highlight() {
  if (!gd_get_setting('no_non_breaking_space')) {
    jQuery('tr.preview > td.translation.foreign-text, blockquote.translation > em > small').each(function() {
      var translation_item = jQuery(this).html();
      if (translation_item.indexOf('&nbsp;') > -1) {
        jQuery(this).html(DOMPurify.sanitize(translation_item.replace(/([^>])&nbsp;/g, '$1<span style="background-color:yellow">&nbsp;</span>')));
      }
    });
  }
}

/**
 * Highlight in preview the curly apostrophe
 *
 * @returns {void}
 */
function gd_curly_apostrophe_highlight() {
  if (!gd_get_setting('curly_apostrophe_warning')) {
    jQuery('tr.preview > td.translation.foreign-text, blockquote.translation > em > small').each(function() {
      var translation_item = jQuery(this).html();
      if (translation_item.indexOf('’') > -1) {
        jQuery(this).html(DOMPurify.sanitize(translation_item.replace(/([^>])’/g, '$1<span' +
            ' style="background-color:yellow">’</span>')));
      }
    });
  }
}

/**
 * Get the language for consistency
 *
 * @returns string
 */
function gd_get_lang_consistency() {
  var lang = gd_get_lang();
  var reallang = '';
  if (lang === 'pt_BR') {
    reallang = 'pt-br';
  } else if (lang === 'en_CA') {
    reallang = 'en-ca';
  } else {
    reallang = lang.split('_');
    if (typeof reallang[1] !== 'undefined') {
      reallang = reallang[1].toLowerCase();
    }
  }
  return reallang;
}

/**
 * Check if the string is the same
 *
 * @param {String} myString
 * @returns {Boolean}
 */
function gd_is_uppercase(myString) {
  var lower = myString.toLowerCase();
  var upper = myString.toUpperCase();
  return (lower !== upper && myString === upper);
}

/**
 * Stop event propagation
 *
 * @param {Object} e
 * @returns {void}
 */
function gd_stoppropagation(e) {
  if (typeof e === 'object') {
    e.stopImmediatePropagation();
  }
}

/**
 * Add a layover
 *
 * @returns {void}
 */
function gd_add_layover() {
  if (jQuery('table#translations').length > 0) {
    jQuery('body').append('<div class="gd-layover"></div>');
    jQuery('.gd-layover').append('<div class="gd-loader"></div>');
  }
}

/**
 * Remove the layover
 *
 * @returns {void}
 */
function gd_remove_layover() {
  jQuery('.gd-layover').remove();
}

/**
 * Mutations Observer for Translation Table Changes
 *
 * @triggers gd_add_column, gd_add_meta
 */
function gd_wait_table_alter() {
  if (document.querySelector('#translations tbody') !== null) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (document.querySelector('#bulk-actions-toolbar-top') === null) {
          return;
        }
        mutation.addedNodes.forEach(function(addedNode) {
          if (addedNode.nodeType !== 1) {
            return;
          }
          if (addedNode.classList.contains('editor') && mutation.previousSibling && !mutation.previousSibling.matches('.editor.untranslated')) {
            var next_row_editor = addedNode.nextElementSibling.nextElementSibling;
            var next_row_preview = next_row_editor.previousElementSibling;
            if (!next_row_editor || !next_row_preview) { return; }
            next_row_editor.style.display = 'none';
            next_row_preview.style.display = 'table-row';
          }
          if (addedNode.classList.contains('preview')) {
            gd_add_column_buttons(addedNode);
          }
        });
        gd_add_meta();
      });
    });

    observer.observe(document.querySelector('#translations tbody'), {
      attributes: true,
      childList: true,
      characterData: true
    });
  }
}
