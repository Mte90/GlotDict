function gd_add_column() {
  if (jQuery('#translations thead tr th').length < 6) {
    jQuery('#translations thead tr').append('<th></th>');
  }
  jQuery('#translations tr.preview').each(function() {
    if (jQuery(this).find('td').length < 5) {
      gd_add_column_buttons(this);
    }
  });
}

function gd_add_column_buttons(tr_preview) {
  var td_buttons = document.createElement('TD');
  tr_preview.append(td_buttons);
  tr_preview.nextElementSibling.querySelectorAll('.meta button').forEach(function(button) {
    button.removeAttribute('tabindex');
    var clone_button = button.cloneNode(true);
    clone_button.classList.add('gd-' + clone_button.classList[0]);
    clone_button.addEventListener('click', function(e) {
      var button = (e.target.parentElement.nodeName === 'BUTTON') ? e.target.parentElement : e.target;
      if (!button) { return; }
      var strong = button.querySelector('strong');
      button.disabled = true;
      button.style.color = '#afafaf';
      if (strong) {
        strong.classList.add('gd-btn-action');
      }
      var editor = button.closest('tr.preview').nextElementSibling;
      var new_status = button.classList[0];
      new_status = new_status === 'approve' ? 'current' : new_status;
      new_status = new_status === 'reject' ? 'rejected' : new_status;
      $gp.editor.show(jQuery(button));
      $gp.editor.set_status(jQuery(button), new_status);
      if (editor) {
        editor.style.display = 'none';
      }
      button.closest('tr.preview').style.display = 'table-row';
    });
    if (!tr_preview.classList.contains('untranslated')) {
      td_buttons.append(clone_button);
    }
  });
}
