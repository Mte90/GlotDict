if ( typeof $gp !== 'undefined' ){
  var gd_quicklinks_copy_state = localStorage.getItem( 'gd_quicklinks_copy_state' ) === 'true';
  var gd_quicklinks_window = { 'closed': true };
  gd_quicklinks();
  gd_consistency();
}

function gd_quicklinks(){
  var gd_quicklinks_output = createElement( 'span', { 'class': 'gd_quicklinks' } );
  var gd_quicklinks_copy = createElement(
    'button',
    {
      'type': 'button',
      'class': 'gd_quicklinks_copy with-tooltip' + ( ( gd_quicklinks_copy_state ) ? ' active' : ' inactive' ),
      'aria-label':'Click this and another to copy'
    }
  );
  gd_quicklinks_copy.append(
    createElement ( 'span', { 'class': 'screen-reader-text' }, 'Copy toggle' ),
    createElement ( 'span', { 'class': 'dashicons dashicons-clipboard', 'aria-hidden': 'true' } )
  );
  var gd_quicklinks_separator = createElement(
    'span',
    {
      'class': 'gd_quicklinks_plus dashicons' + ( ( gd_quicklinks_copy_state ) ? ' dashicons-plus' : ' separator' ),
      'aria-hidden': 'true'
    }
  );
  var gd_quicklinks_permalink = createElement( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_permalink with-tooltip', 'aria-label': 'Permalink to translation' } );
  gd_quicklinks_permalink.append(
    createElement ( 'span', { 'class': 'screen-reader-text' }, 'Permalink to translation' ),
    createElement ( 'span', { 'class': 'dashicons dashicons-admin-links', 'aria-hidden': 'true' } )
  );

  var gd_quicklinks_history = createElement( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_history with-tooltip', 'aria-label': 'Translation History' } );
  gd_quicklinks_history.append(
    createElement ( 'span', { 'class': 'screen-reader-text' }, 'Translation History' ),
    createElement ( 'span', { 'class': 'dashicons dashicons-backup', 'aria-hidden': 'true' } )
  );

  var gd_quicklinks_consistency = createElement( 'button', { 'class': 'gd_quicklinks_item gd_quicklinks_consistency with-tooltip', 'aria-label': 'View original in consistency tool' } );
  gd_quicklinks_consistency.append(
    createElement ( 'span', { 'class': 'screen-reader-text' }, 'View original in consistency tool' ),
    createElement ( 'span', { 'class': 'dashicons dashicons-list-view', 'aria-hidden': 'true' } )
  );

  gd_quicklinks_output.append(
    gd_quicklinks_copy,
    gd_quicklinks_separator,
    gd_quicklinks_permalink,
    gd_quicklinks_history,
    gd_quicklinks_consistency
  );

  addElements( '.editor-panel__right .panel-header', 'beforeend', gd_quicklinks_output );

  document.querySelectorAll( '.editor' ).forEach( function( editor ){
    var editor_menu = editor.querySelectorAll( '.button-menu__dropdown li a' );
    editor.querySelector( '.gd_quicklinks_permalink' ).dataset.quicklink = editor_menu[ 0 ].href;
    editor_menu[ 1 ].href += '&historypage';
    editor.querySelector( '.gd_quicklinks_history' ).dataset.quicklink =  editor_menu[ 1 ].href;
    editor.querySelector( '.gd_quicklinks_consistency' ).dataset.quicklink = editor_menu[ 2 ].href + '&consistencypage';
  } );

  addEvtListener( 'click', '.gd_quicklinks_copy, .gd_quicklinks_plus', gd_toggle_quicklinks_copy );
  addEvtListener( 'click', '.gd_quicklinks_item', gd_do_quicklinks );
}

function gd_do_quicklinks( event ) {
  if ( gd_quicklinks_copy_state ) {
    var btn_target = event.currentTarget;
    var current_aria_label = btn_target.getAttribute( 'aria-label' );
    copyToClipboard( event.currentTarget.dataset.quicklink );
    btn_target.setAttribute( 'aria-label', 'Copied!' );
    setTimeout( function() { btn_target.setAttribute( 'aria-label', current_aria_label ); }, 2000 );
  } else {
      if ( ! gd_quicklinks_window.closed ) {
        gd_quicklinks_window.close();
      }
    gd_quicklinks_window = window.open( event.currentTarget.dataset.quicklink, '_blank' );
  }
}

function gd_toggle_quicklinks_copy() {
  document.querySelectorAll( '.gd_quicklinks_plus' ).forEach( function( el ) {
    el.classList.toggle( 'dashicons-plus' );
    el.classList.toggle( 'separator' );
  } );
  document.querySelectorAll( '.gd_quicklinks_copy' ).forEach( function( el ) {
    el.classList.toggle( 'active' );
    el.classList.toggle( 'inactive' );
  } );
  gd_quicklinks_copy_state = ! gd_quicklinks_copy_state;
  localStorage.setItem( 'gd_quicklinks_copy_state', gd_quicklinks_copy_state );
}

function gd_consistency(){
  var gd_consistency_output = createElement( 'details', { 'class': 'gd_consistency suggestions__translation-consistency', 'open': 'open' } );
  var gd_consistency_summary = createElement( 'summary', { }, 'Suggestions from Consistency' );
  var gd_consistency_button = createElement( 'button', { 'class': 'gd_get_consistency' }, 'View Consistency suggestions' );
  gd_consistency_output.append( gd_consistency_summary, gd_consistency_button );

  addElements( '.editor-panel__left .suggestions-wrapper', 'beforeend', gd_consistency_output );
  addEvtListener( 'click', '.gd_get_consistency', gd_show_consistency );
}

function gd_show_consistency( event ) {
  event.target.textContent = 'Loading...';
  var consistency_url = event.target.closest( '.editor-panel' ).querySelectorAll( '.button-menu__dropdown li a' )[ 2 ].href;

  fetch( consistency_url )
    .then( consistency_response => consistency_response.text() )
    .then( consistency_response => {
      var consistency_parser = new DOMParser();
      var consistency_page = consistency_parser.parseFromString( consistency_response , 'text/html' );
      var consistency_translations = consistency_page.querySelectorAll( '.consistency-table tbody th strong' );
      var translations_count, unique_translation_count;

      if ( consistency_translations.length == 1 ) {
        unique_translation_count = consistency_page.querySelectorAll( 'tr' ).length - 2;
        unique_translation_count = ' ('+ unique_translation_count + ' time' + ( ( unique_translation_count > 1 ) ? 's' : '' ) + ')';
      } else {
          translations_count = consistency_page.querySelectorAll( '.translations-unique small' );
      }

      var gd_consistency_suggestions;

      if ( consistency_translations.length ) {
        var gd_consistency_item,
        gd_consistency_item_div,
        gd_consistency_item_translation,
        gd_consistency_item_index,
        gd_consistency_item_count,
        gd_consistency_item_raw,
        gd_consistency_item_button;

        gd_consistency_suggestions = createElement( 'ul', { class: 'suggestions-list' } );

        for ( var i = 0; i < consistency_translations.length; i++ ) {
          gd_consistency_item = document.createElement( 'li' );
          gd_consistency_item_div = createElement( 'div', { 'class': 'translation-suggestion with-tooltip', 'role': 'button', 'aria-pressed': 'false', 'aria-label': 'Copy translation', 'tabindex': '0' } );
          gd_consistency_item_translation = createElement( 'span', { 'class': 'translation-suggestion__translation' }, consistency_translations[ i ].textContent );
          gd_consistency_item_index = createElement( 'span', { 'class': 'translation-suggestion__translation index' }, ( i + 1 ) + ': ' );
          gd_consistency_item_count = createElement( 'span', { 'class': 'consistency-count' }, ( consistency_translations.length == 1 ) ? unique_translation_count : translations_count[ i ].textContent );
          gd_consistency_item_raw = createElement( 'span', { 'class': 'translation-suggestion__translation-raw', 'aria-hidden': 'true' }, consistency_translations[ i ].textContent );
          gd_consistency_item_button = createElement( 'button', { 'type': 'button', 'class': 'copy-suggestion' }, 'Copy' );
          gd_consistency_item_translation.prepend( gd_consistency_item_index );
          gd_consistency_item_translation.append( gd_consistency_item_count );
          gd_consistency_item_div.append( gd_consistency_item_translation, gd_consistency_item_raw, gd_consistency_item_button );
          gd_consistency_item.append( gd_consistency_item_div );
          gd_consistency_suggestions.append( gd_consistency_item );
        }
      } else {
          gd_consistency_suggestions = 'No suggestions.';
      }
      event.target.before ( gd_consistency_suggestions );
      event.target.parentNode.removeChild( event.target );
    } )
    .catch( error => console.log( error ) );
}
