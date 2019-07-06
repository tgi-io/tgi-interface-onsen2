/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/play/prototype.js
 */
const openMenu = () => {
  document.querySelector('#menu').open();
};

const openRightMenu = () => {
  document.querySelector('#rightMenu').open();
};

const loadPage = (page) => {
  document.querySelector('#menu').close();
  document.querySelector('#rightMenu').close();
  // document.querySelector('#navigator').bringPageTop(page, { animation: 'fade' });
  document.querySelector('#navigator').resetToPage(page);
};

const showAlert = function() {
  ons.notification.alert('Alert!');
};

const showConfirm = function() {
  ons.notification.confirm('Confirm!')
};

const showPrompt = function() {
  ons.notification.prompt('Prompt!')
    .then(function(input) {
      var message = input ? 'Entered: ' + input : 'Entered nothing!';
      ons.notification.alert(message);
    });
};

const showToast = function(ttt) {
  ons.notification.toast('Information</br>' + ttt, {
    timeout: 2000
  });
};

const actionJackson = function() {
  ons.openActionSheet({
    title: 'From object',
    cancelable: true,
    buttons: [
      'Label 0',
      'Label 1',
      {
        label: 'Label 2',
        modifier: 'destructive'
      },
      {
        label: 'Cancel',
        icon: 'md-close'
      }
    ]
  }).then(function (index) { showToast('index: ' +  index) });
};
