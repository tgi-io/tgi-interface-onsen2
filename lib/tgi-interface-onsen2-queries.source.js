/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/lib/tgi-interface-onsen2-queries.source.js
 */

/**
 * Called at startup for initial html
 */
Onsen2Interface.prototype.htmlDialog = function () {
  var onsen2Interface = this;
  var addEle = Onsen2Interface.addEle;
  var modalDialog, modalContent, modalHeader, modalBody, modalFooter, modalOK, modalCancel, modalYes, modalNo, choice;

  /**
   * ok()
   */
  this.doc.okDialog = addEle(document.body, 'div', 'modal fade', {
    tabindex: '-1',
    role: 'dialog',
    'aria-hidden': true
  });
  modalDialog = addEle(this.doc.okDialog, 'div', 'modal-dialog');
  modalContent = addEle(modalDialog, 'div', 'modal-content');
  modalHeader = addEle(modalContent, 'div', 'modal-header', {style: 'text-align: center'});
  this.doc.okDialogTitle = addEle(modalHeader, 'h4', 'modal-title', {style: 'text-align: center'});
  this.doc.okDialogBody = addEle(modalContent, 'div', 'modal-body', {style: 'text-align: center'});
  modalFooter = addEle(modalContent, 'div', 'modal-footer', {style: 'text-align: center'});
  modalOK = addEle(modalFooter, 'button', 'btn btn-primary');
  modalOK.innerHTML = '&nbsp;&nbsp;OK&nbsp;&nbsp;';
  $(modalOK).on('click', function () {
    $(onsen2Interface.doc.okDialog).modal('hide');
  });
  $(this.doc.okDialog).on('hidden.bs.modal', function (e) {
    if (onsen2Interface.okcallback) {
      var callback = onsen2Interface.okcallback;
      delete onsen2Interface.okcallback;
      callback();
    }
  });
  /**
   * yesno()
   */
  this.doc.yesnoDialog = addEle(document.body, 'div', 'modal fade', {
    tabindex: '-1',
    role: 'dialog',
    'aria-hidden': true
  });
  modalDialog = addEle(this.doc.yesnoDialog, 'div', 'modal-dialog');
  modalContent = addEle(modalDialog, 'div', 'modal-content');
  modalHeader = addEle(modalContent, 'div', 'modal-header', {style: 'text-align: center'});
  this.doc.yesnoDialogTitle = addEle(modalHeader, 'h4', 'modal-title', {style: 'text-align: center'});
  this.doc.yesnoDialogBody = addEle(modalContent, 'div', 'modal-body', {style: 'text-align: center'});
  modalFooter = addEle(modalContent, 'div', 'modal-footer', {style: 'text-align: center'});
  modalYes = addEle(modalFooter, 'button', 'btn btn-success');
  modalYes.innerHTML = '&nbsp;<u>Y</u>es&nbsp;';
  $(modalYes).on('click', function () {
    $(onsen2Interface.doc.yesnoDialog).modal('hide');
    onsen2Interface.yesnoResponse = true;
  });
  modalNo = addEle(modalFooter, 'button', 'btn btn-danger');
  modalNo.innerHTML = '&nbsp;<u>N</u>o&nbsp;&nbsp;';
  $(modalNo).on('click', function () {
    $(onsen2Interface.doc.yesnoDialog).modal('hide');
    onsen2Interface.yesnoResponse = false;
  });
  $(this.doc.yesnoDialog).on('hidden.bs.modal', function (e) {
    if (onsen2Interface.yesnocallback) {
      var callback = onsen2Interface.yesnocallback;
      delete onsen2Interface.yesnocallback;
      callback(onsen2Interface.yesnoResponse);
    }
  });
  /**
   * ask()
   */
  this.doc.askDialog = addEle(document.body, 'div', 'modal fade', {
    tabindex: '-1',
    role: 'dialog',
    'aria-hidden': true
  });
  modalDialog = addEle(this.doc.askDialog, 'div', 'modal-dialog');
  modalContent = addEle(modalDialog, 'div', 'modal-content');
  modalHeader = addEle(modalContent, 'div', 'modal-header', {style: 'text-align: center'});
  this.doc.askDialogTitle = addEle(modalHeader, 'h4', 'modal-title', {style: 'text-align: center'});
  modalBody = addEle(modalContent, 'div', 'modal-body', {style: 'text-align: center'});
  this.doc.askDialogPrompt = addEle(modalBody, 'div', 'modal-body');
  this.doc.askDialogInput = addEle(modalBody, 'input', 'form-control', {style: 'margin:0 auto; width:80%;'});
  $(this.doc.askDialogInput).keypress(function (e) {
    if (e.which == 13) {
      onsen2Interface.askResponse = onsen2Interface.doc.askDialogInput.value;
      $(onsen2Interface.doc.askDialog).modal('hide');
    }
  });
  modalFooter = addEle(modalContent, 'div', 'modal-footer', {style: 'text-align: center'});
  modalOK = addEle(modalFooter, 'button', 'btn btn-primary');
  modalOK.innerHTML = '&nbsp;&nbsp;OK&nbsp;&nbsp;';
  $(modalOK).on('click', function () {
    onsen2Interface.askResponse = onsen2Interface.doc.askDialogInput.value;
    $(onsen2Interface.doc.askDialog).modal('hide');
  });
  modalCancel = addEle(modalFooter, 'button', 'btn btn-default');
  modalCancel.innerHTML = 'Cancel';
  $(modalCancel).on('click', function () {
    onsen2Interface.askResponse = undefined;
    $(onsen2Interface.doc.askDialog).modal('hide');
  });
  $(this.doc.askDialog).on('hidden.bs.modal', function (e) {
    if (onsen2Interface.askcallback) {
      var callback = onsen2Interface.askcallback;
      delete onsen2Interface.askcallback;
      callback(onsen2Interface.askResponse);
    }
  });
  $(this.doc.askDialog).on('shown.bs.modal', function (e) {
    $(onsen2Interface.doc.askDialog).focus();
    $(onsen2Interface.doc.askDialogInput).focus();
  });
  /**
   * choose()
   */
  this.doc.chooseDialog = addEle(document.body, 'div', 'modal fade', {
    tabindex: '-1',
    role: 'dialog',
    'aria-hidden': true
  });
  modalDialog = addEle(this.doc.chooseDialog, 'div', 'modal-dialog');
  modalContent = addEle(modalDialog, 'div', 'modal-content');
  modalHeader = addEle(modalContent, 'div', 'modal-header', {style: 'text-align: center'});
  this.doc.chooseDialogTitle = addEle(modalHeader, 'h4', 'modal-title', {style: 'text-align: center'});
  modalBody = addEle(modalContent, 'div', 'modal-body', {style: 'text-align: center'});
  this.doc.chooseDialogPrompt = addEle(modalBody, 'div', 'modal-body', {style: 'text-align: center'});
  this.doc.chooseDialogButtons = [];
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 0;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 1;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 2;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 3;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 4;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 5;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 6;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 7;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 8;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 9;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 10;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 11;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 12;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 13;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 14;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 15;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 16;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 17;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 18;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 19;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  choice = addEle(modalBody, 'button', 'btn btn-default btn-block');
  $(choice).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = 20;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  this.doc.chooseDialogButtons.push(choice);
  modalFooter = addEle(modalContent, 'div', 'modal-footer', {style: 'text-align: center'});
  modalCancel = addEle(modalFooter, 'button', 'btn btn-default btn-block');
  modalCancel.innerHTML = '<b class="text-danger">Cancel</b>';
  $(modalCancel).on('click', function () {
    onsen2Interface.doc.chooseDialogChoice = undefined;
    $(onsen2Interface.doc.chooseDialog).modal('hide');
  });
  $(this.doc.chooseDialog).on('hidden.bs.modal', function (e) {
    if (onsen2Interface.choosecallback) {
      var callback = onsen2Interface.choosecallback;
      delete onsen2Interface.choosecallback;
      callback(onsen2Interface.doc.chooseDialogChoices[onsen2Interface.doc.chooseDialogChoice]);
    }
  });
};
Onsen2Interface.prototype.info = function (text) {
  var self = this;
  var notify = $.notify(
    {
      /**
       * options
       */
      icon: 'glyphicon glyphicon-info-sign',
      title: 'Information',
      message: text,
      //url: 'https://github.com/mouse0270/onsen2-notify',
      //target: '_blank'
    },
    {
      /**
       * settings
       */
      element: 'body',
      position: null,
      type: "info",
      allow_dismiss: true,
      newest_on_top: true,
      placement: {
        from: "top",
        align: "right"
      },
      offset: {
        x: 20,
        y: self.doc.navBarHeader.offsetHeight + 20
      },
      spacing: 10,
      z_index: 1031,
      delay: 0,
      timer: 1000,
      //url_target: '_blank',
      mouse_over: null,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      onShow: null,
      onShown: null,
      onClose: null,
      onClosed: null,
      icon_type: 'class',
      template: '<div data-notify="container" class="col-xs-11 col-sm-6 alert alert-notify alert-{0}" role="alert">' +
      '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
      '<h4>' +
      '<span data-notify="icon"></span> ' +
      '<span data-notify="title">{1}</span>' +
      '</h4>' +
      '<span data-notify="message">{2}</span>' +
      '<div class="progress" data-notify="progressbar">' +
      '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
      '</div>' +
        //'<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>'
    }
  );
  setTimeout(function () {
    notify.close();
  }, 3000);
};
Onsen2Interface.prototype.done = function (text) {
  var self = this;
  var notify = $.notify(
    {
      /**
       * options
       */
      icon: 'glyphicon glyphicon-saved',
      title: 'Done',
      message: text
      //url: 'https://github.com/mouse0270/onsen2-notify',
      //target: '_blank'
    },
    {
      /**
       * settings
       */
      element: 'body',
      position: null,
      type: "success",
      allow_dismiss: true,
      newest_on_top: true,
      placement: {
        from: "top",
        align: "right"
      },
      offset: {
        x: 20,
        y: self.doc.navBarHeader.offsetHeight + 20
      },
      spacing: 10,
      z_index: 1031,
      delay: 0,
      timer: 1000,
      //url_target: '_blank',
      mouse_over: null,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      onShow: null,
      onShown: null,
      onClose: null,
      onClosed: null,
      icon_type: 'class',
      template: '<div data-notify="container" class="col-xs-11 col-sm-6 alert alert-notify alert-{0}" role="alert">' +
      '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
      '<h4>' +
      '<span data-notify="icon"></span> ' +
      '<span data-notify="title">{1}</span>' +
      '</h4>' +
      '<span data-notify="message">{2}</span>' +
      '<div class="progress" data-notify="progressbar">' +
      '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
      '</div>' +
        //'<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>'
    }
  );
  setTimeout(function () {
    notify.close();
  }, 3000);
};
Onsen2Interface.prototype.warn = function (text) {
  var self = this;
  var notify = $.notify(
    {
      /**
       * options
       */
      icon: 'glyphicon glyphicon-exclamation-sign',
      title: 'Warning',
      message: text,
      //url: 'https://github.com/mouse0270/onsen2-notify',
      //target: '_blank'
    },
    {
      /**
       * settings
       */
      element: 'body',
      position: null,
      type: "warning",
      allow_dismiss: true,
      newest_on_top: true,
      placement: {
        from: "top",
        align: "right"
      },
      offset: {
        x: 20,
        y: self.doc.navBarHeader.offsetHeight + 20
      },
      spacing: 10,
      z_index: 1031,
      delay: 0,
      timer: 1000,
      //url_target: '_blank',
      mouse_over: null,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      onShow: null,
      onShown: null,
      onClose: null,
      onClosed: null,
      icon_type: 'class',
      template: '<div data-notify="container" class="col-xs-11 col-sm-6 alert alert-notify alert-{0}" role="alert">' +
      '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
      '<h4>' +
      '<span data-notify="icon"></span> ' +
      '<span data-notify="title">{1}</span>' +
      '</h4>' +
      '<span data-notify="message">{2}</span>' +
      '<div class="progress" data-notify="progressbar">' +
      '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
      '</div>' +
        //'<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>'
    }
  );
  setTimeout(function () {
    notify.close();
  }, 3000);
};
Onsen2Interface.prototype.err = function (text) {
  var self = this;
  var notify = $.notify(
    {
      /**
       * options
       */
      icon: 'glyphicon glyphicon-warning-sign',
      title: 'Error',
      message: text,
      //url: 'https://github.com/mouse0270/onsen2-notify',
      //target: '_blank'
    },
    {
      /**
       * settings
       */
      element: 'body',
      position: null,
      type: "danger",
      allow_dismiss: true,
      newest_on_top: true,
      placement: {
        from: "top",
        align: "right"
      },
      offset: {
        x: 20,
        y: self.doc.navBarHeader.offsetHeight + 20
      },
      spacing: 10,
      z_index: 1031,
      delay: 0,
      timer: 1000,
      //url_target: '_blank',
      mouse_over: null,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      onShow: null,
      onShown: null,
      onClose: null,
      onClosed: null,
      icon_type: 'class',
      template: '<div data-notify="container" class="col-xs-11 col-sm-6 alert alert-notify alert-{0}" role="alert">' +
      '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
      '<h4>' +
      '<span data-notify="icon"></span> ' +
      '<span data-notify="title">{1}</span>' +
      '</h4>' +
      '<span data-notify="message">{2}</span>' +
      '<div class="progress" data-notify="progressbar">' +
      '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
      '</div>' +
        //'<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>'
    }
  );
  setTimeout(function () {
    notify.close();
  }, 3000);
};
Onsen2Interface.prototype.ok = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.okPending) {
    delete this.okPending;
    callback();
  } else {
    this.doc.okDialogTitle.innerHTML = this.application ? this.application.get('brand') : '?';
    this.doc.okDialogBody.innerHTML = prompt;
    $(this.doc.okDialog).modal();
    this.okcallback = callback;
  }
};
Onsen2Interface.prototype.yesno = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.yesnoPending) {
    delete this.yesnoPending;
    callback(this.yesnoResponse);
  } else {
    this.doc.yesnoDialogTitle.innerHTML = this.application.get('brand');
    this.doc.yesnoDialogBody.innerHTML = prompt;
    $(this.doc.yesnoDialog).modal();
    this.yesnocallback = callback;
  }
};
Onsen2Interface.prototype.ask = function (prompt, attribute, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (attribute instanceof Attribute)) throw new Error('attribute or callback expected');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.askPending) {
    delete this.askPending;
    callback(this.askResponse);
  } else {
    this.doc.askDialogTitle.innerHTML = this.application.get('brand');
    this.doc.askDialogPrompt.innerHTML = prompt + '<br><br>';
    this.doc.askDialogInput.value = attribute.value;
    $(this.doc.askDialog).modal();
    this.askcallback = callback;
  }
};
Onsen2Interface.prototype.choose = function (prompt, choices, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (choices instanceof Array)) throw new Error('choices array required');
  if (!choices.length) throw new Error('choices array empty');
  if (typeof callback != 'function') throw new Error('callback required');
  if (this.choosePending) {
    delete this.choosePending;
    callback(Interface.firstMatch(this.chooseResponse, choices));
  } else {
    if (choices.length > this.doc.chooseDialogButtons.length) throw new Error('max choices reached in choose');
    this.doc.chooseDialogTitle.innerHTML = this.application.get('brand');
    this.doc.chooseDialogPrompt.innerHTML = prompt.replace(/\n/g, '<br>');
    $(this.doc.chooseDialog).modal();
    this.choosecallback = callback;
    this.doc.chooseDialogChoices = choices;
    for (var i = 0; i < this.doc.chooseDialogButtons.length; i++) {
      if (i < choices.length) {
        this.doc.chooseDialogButtons[i].innerHTML = '<b class="text-primary">' + choices[i] + '</b>';
        $(this.doc.chooseDialogButtons[i]).show();
      } else {
        $(this.doc.chooseDialogButtons[i]).hide();
      }
    }
  }
  /**
   * Since framework does not return any info in callback
   */
  function cbCancel() {
    callback();
  }

  function cb0() {
    callback(choices[0]);
  }

  function cb1() {
    callback(choices[1]);
  }

  function cb2() {
    callback(choices[2]);
  }

  function cb3() {
    callback(choices[3]);
  }

  function cb4() {
    callback(choices[4]);
  }

  function cb5() {
    callback(choices[5]);
  }

  function cb6() {
    callback(choices[6]);
  }

  function cb7() {
    callback(choices[7]);
  }

  function cb8() {
    callback(choices[8]);
  }

  function cb9() {
    callback(choices[9]);
  }
};
