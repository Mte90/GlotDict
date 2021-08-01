if ( typeof $gp !== 'undefined' ){
  var gd_quicklinks_copy_state = localStorage.getItem( 'gd_quicklinks_copy_state' ) === 'true';
  var gd_quicklinks_window = { 'closed': true };
  gd_quicklinks();
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
