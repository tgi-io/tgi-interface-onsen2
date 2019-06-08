/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/lib/tgi-interface-onsen2-panels.source.js
 */

/**
 * Called at startup for initial html
 */
Onsen2Interface.prototype.htmlPanels = function () {
  var onsen2Interface = this;
  var addEle = Onsen2Interface.addEle;

  /**
   * Main container for panels
   */
  this.doc.mainContainer = addEle(document.body, 'ons-splitter');
  // this.doc.panelRow = addEle(this.doc.mainContainer, 'div', 'row');
};

/**
 * activatePanel will create if needed, make panel visible and render contents
 */
Onsen2Interface.prototype.activatePanel = function (command) {

  var onsen2Interface = this;
  var addEle = Onsen2Interface.addEle;
  var addTopEle = Onsen2Interface.addTopEle;
  var presentation = command.contents;
  var name = presentation.get('name') || command.name;
  var theme = command.theme || 'default';
  var icon = command.icon;
  if (icon) {
    if (left(icon, 2) == 'fa')
      icon = '<i class="fa ' + icon + '"></i>&nbsp;';
    else
      icon = '<span class="glyphicon ' + icon + '"></span>&nbsp;';
  }
  var title = icon ? icon + name : name;

  /**
   * this.panels array of panels
   */
  if (typeof this.panels == 'undefined')
    this.panels = [];

  /**
   * See if command already has a panel
   */
  var panel;
  for (var i = 0; (typeof panel == 'undefined') && i < this.panels.length; i++) {
    if (name == this.panels[i].name)
      panel = this.panels[i];
  }

  /**
   * For now destroy and recreate panel
   */
  if (typeof panel != 'undefined') {
    onsen2Interface.destroyPanel(panel);
    panel = undefined;
  }

  /**
   * If we did not find panel create
   */
  if (typeof panel == 'undefined') {
    panel = {
      name: name,
      listeners: [],
      attributeListeners: [],
      textListeners: []
    };
    this.panels.push(panel);

    /**
     * Main framing and title text
     */
    panel.panelDiv = addTopEle(this.doc.panelRow, 'div', 'panel panel-' + theme);
    panel.panelHeading = addEle(panel.panelDiv, 'div', 'panel-heading');
    panel.panelTitle = addEle(panel.panelHeading, 'div', 'panel-title');
    panel.panelTitleText = addEle(panel.panelTitle, 'a', 'panel-title-text', {href: '#'});
    panel.panelTitleText.innerHTML = title;
    panel.panelBody = addEle(panel.panelDiv, 'div', 'panel-body bg-' + theme);
    panel.panelWell = addEle(panel.panelBody, 'div', 'well-panel');
    panel.panelForm = addEle(panel.panelWell, 'form', 'form-horizontal');

    /**
     * Close Panel Button
     */
    panel.panelClose = addEle(panel.panelTitle, 'a', undefined, {href: '#'});
    panel.panelClose.innerHTML = '<span class="glyphicon glyphicon-remove panel-glyph-right pull-right text-muted"></span>';
    $(panel.panelClose).click(function (e) {
      onsen2Interface.destroyPanel(panel);
      e.preventDefault();
    });
    panel.listeners.push(panel.panelClose); // so we can avoid leakage on deleting panel

    /**
     * Hide Panel Button
     */
    panel.panelHide = addEle(panel.panelTitle, 'a', undefined, {href: '#'});
    panel.panelHide.innerHTML = '<span class="glyphicon glyphicon-chevron-down panel-glyph-right pull-right text-muted"></span>';
    $(panel.panelHide).click(function (e) {
      $(panel.panelBody).hide('fast');
      $(panel.panelHide).hide();
      $(panel.panelShow).show();
      e.preventDefault();
    });
    panel.listeners.push(panel.panelHide);

    /**
     * Show Panel Button
     */
    panel.panelShow = addEle(panel.panelTitle, 'a', undefined, {href: '#'});
    panel.panelShow.innerHTML = '<span class="glyphicon glyphicon-chevron-left panel-glyph-right pull-right text-muted"></span>';
    $(panel.panelShow).hide();
    $(panel.panelShow).click(function (e) {
      $(panel.panelBody).show('fast');
      $(panel.panelHide).show();
      $(panel.panelShow).hide();
      e.preventDefault();
    });
    panel.listeners.push(panel.panelShow);

  }

  /**
   * Render panel body
   */
  onsen2Interface.renderPanelBody(panel, command);
  $(panel.panelBody).show('fast'); //
  $(panel.panelHide).show();
  $(panel.panelShow).hide();
  $('html, body').animate({
    scrollTop: $(panel.panelDiv).offset().top - $(onsen2Interface.doc.sideMenu).height() - 8
  }, 250);
};

/**
 * When deleting panel remove references to avoid leakage
 */
Onsen2Interface.prototype.destroyPanel = function (panel) {
  var onsen2Interface = this;
  var i, ele;
  /**
   * Remove this panel from global panel list
   */
  for (i = 0; i < onsen2Interface.panels.length; i++) {
    if (panel == onsen2Interface.panels[i])
      onsen2Interface.panels.splice(i, 1);
  }
  /**
   * Remove listeners before deleting
   */
  for (i = 0; i < panel.listeners.length; i++) {
    ele = panel.listeners[i];
    $(ele).off();
  }
  for (i = 0; i < panel.attributeListeners.length; i++) {
    ele = panel.attributeListeners[i];
    ele.offEvent();
  }
  for (i = 0; i < panel.textListeners.length; i++) {
    ele = panel.textListeners[i];
    ele.offEvent();
  }

  /**
   * Causes memory leaking when doing soak test
   */
  $('html, body').stop();

  /**
   * Remove panel from
   */
  $(panel.panelDiv).remove();

};

/**
 * renderPanelBody will insert the html into the body of the panel for View presentation mode
 */
Onsen2Interface.prototype.renderPanelBody = function (panel, command) {
  var onsen2Interface = this;
  var addEle = Onsen2Interface.addEle;
  var i, j, indent = false, txtDiv;
  var contents = command.contents.get('contents');
  panel.buttonDiv = null;
  $(panel.panelForm).empty();
  for (i = 0; i < contents.length; i++) {
    if (typeof contents[i] == 'string') {
      switch (contents[i]) {
        case '-':
          panel.panelForm.appendChild(document.createElement("hr"));
          break;
        case '>':
          indent = true;
          break;
        case '<':
          indent = false;
          break;
        default:
          txtDiv = addEle(panel.panelForm, 'div', indent ? 'col-sm-offset-3' : '');
          txtDiv.innerHTML = marked(contents[i]);
          break;
      }
    }
    if (contents[i] instanceof Text) renderText(contents[i]);
    if (contents[i] instanceof Attribute) renderAttribute(contents[i], command.presentationMode);
    if (contents[i] instanceof List) renderList(contents[i], command.theme);
    if (contents[i] instanceof Command) renderCommand(contents[i]);
  }
  /**
   * function to render Attribute
   */
  function renderText(text) {
    var textDiv = addEle(panel.panelForm, 'div', indent ? 'col-sm-offset-3' : '');
    textDiv.innerHTML = marked(text.get());
    text.onEvent('StateChange', function () {
      textDiv.innerHTML = marked(text.get());
    });
    panel.textListeners.push(text); // so we can avoid leakage on deleting panel
  }

  /**
   * function to render Attribute for Edit
   */
  function renderAttribute(attribute, mode) {

    var daList;
    var daItems;
    var formGroup;
    var label;
    var inputDiv;
    var input;
    var helpTextDiv;
    var sz;
    var button;
    var select;
    var textNode;
    var inputGroupDiv;
    var inputGroupSpan;
    var inputGroupButton;
    var inputGroupDropDownMenu;
    var initSwitchery;
    var items;
    var j;
    var validating;

    /**
     * Create formGroup container and label
     */

    formGroup = addEle(panel.panelForm, 'div', 'form-group');
    addEle(formGroup, 'label', 'col-sm-3 control-label').innerHTML = attribute.label;

    /**
     * Create inputDiv - set with of input based on size of field
     */
    sz = '1';
    if (attribute.size > 2) sz = '2';
    if (attribute.size > 5) sz = '3';
    if (attribute.size > 10) sz = '4';
    if (attribute.size > 20) sz = '5';
    if (attribute.size > 25) sz = '6';
    if (attribute.size > 30) sz = '7';
    if (attribute.size > 40) sz = '8';
    if (attribute.size > 50) sz = '9';
    if (attribute.type == 'Number') sz = '3';
    if (attribute.type == 'Date') sz = '3';
    if (attribute.type == 'Boolean') sz = '3';
    inputDiv = addEle(formGroup, 'div', 'col-sm-' + sz);

    /**
     * Render based on type
     */
    switch (mode + attribute.type) {

      case 'ViewBoolean':
        input = addEle(inputDiv, 'input', 'js-switch');
        input.setAttribute("type", "checkbox");
        if (attribute.value)
          input.setAttribute("checked", "true");

        initSwitchery = new Switchery(input, {
          //color: window.getComputedStyle(panel.panelTitle, null).getPropertyValue('color'),
          color: '#5bc0de', // todo based on panel theme
          secondaryColor: '#dfdfdf',
          className: 'switchery',
          disabled: true,
          disabledOpacity: 0.5,
          speed: '0.1s'
        });
        $(input).on('change', function () {
          attribute.value = input.checked;
        });
        break;

      case 'EditBoolean':
        input = addEle(inputDiv, 'input', 'js-switch');
        input.setAttribute("type", "checkbox");
        if (attribute.value)
          input.setAttribute("checked", "true");

        initSwitchery = new Switchery(input, {
          //color: window.getComputedStyle(panel.panelTitle, null).getPropertyValue('color'),
          color: '#5bc0de', // todo based on panel theme
          secondaryColor: '#dfdfdf',
          className: 'switchery',
          disabled: false,
          disabledOpacity: 0.5,
          speed: '0.1s'
        });
        $(input).on('change', function () {
          attribute.value = input.checked;
        });
        break;

      case 'EditDate':
        inputGroupDiv = addEle(inputDiv, 'div', 'input-group date');
        input = addEle(inputGroupDiv, 'input', 'form-control');
        if (attribute.placeHolder)
          input.setAttribute("placeHolder", attribute.placeHolder);
        if (attribute.value)
          input.value = (1 + attribute.value.getMonth()) + '/' + attribute.value.getDate() + '/' + attribute.value.getFullYear();
        inputGroupSpan = addEle(inputGroupDiv, 'span', 'input-group-addon');
        inputGroupSpan.innerHTML = '<i class="fa fa-calendar"></i>';
        $(inputGroupDiv).datepicker({
          autoclose: true,
          todayBtn: true,
          todayHighlight: true,
          showOnFocus: false
        }).on('hide', function (e) {
          validateInput();
          e.preventDefault();
        });
        panel.listeners.push(inputGroupDiv); // so we can avoid leakage on deleting panel
        break;

      case 'EditNumber':
        input = addEle(inputDiv, 'input', 'form-control');
        if (attribute.placeHolder)
          input.setAttribute("placeHolder", attribute.placeHolder);
        input.setAttribute("type", "number");
        input.setAttribute("maxlength", attribute.size);
        input.setAttribute("value", attribute.value ? attribute.value : 0);
        break;

      case 'EditString':
        if (attribute.quickPick) {
          inputGroupDiv = addEle(inputDiv, 'div', 'input-group');
          input = addEle(inputGroupDiv, 'input', 'form-control');
        } else {
          input = addEle(inputDiv, 'input', 'form-control');
        }
        if (attribute.placeHolder)
          input.setAttribute("placeHolder", attribute.placeHolder);
        input.setAttribute("type", attribute.hint.password ? "password" : "text");
        input.setAttribute("maxlength", attribute.size);
        if (attribute.value)
          input.setAttribute("value", attribute.value);
        if (attribute.quickPick) {
          inputGroupSpan = addEle(inputGroupDiv, 'span', 'input-group-btn');
          inputGroupButton = addEle(inputGroupSpan, 'button', 'btn btn-default dropdown-toggle');
          inputGroupButton.type = 'button';
          inputGroupButton.setAttribute('data-toggle', 'dropdown');
          inputGroupButton.innerHTML = '<span class="caret"></span>';
          daItems = attribute.quickPick;
          daList = '';
          for (j = 0; j < daItems.length; j++) {
            daList += '<li><a href="#">' + daItems[j] + '</a></li>';
          }
          inputGroupDropDownMenu = addEle(inputGroupSpan, 'ul', 'dropdown-menu pull-right');
          inputGroupDropDownMenu.innerHTML = daList;
          $(inputGroupDropDownMenu).click(function (e) {
            input.value = e.originalEvent.srcElement.innerText;
            validateInput();
            e.preventDefault();
          });
          panel.listeners.push(inputGroupDropDownMenu); // so we can avoid leakage on deleting panel
        }
        break;

      case 'ViewDate':
        input = addEle(inputDiv, 'p', 'form-control-static');
        if (attribute.value)
          input.innerHTML = (1 + attribute.value.getMonth()) + '/' + attribute.value.getDate() + '/' + attribute.value.getFullYear();

        break;

      default: // View
        input = addEle(inputDiv, 'p', 'form-control-static');
        input.innerHTML = attribute.value;

    }

    /**
     * When focus lost on attribute - validate it
     */
    var validateInput = function (event) {
      switch (attribute.type) {
        case 'Date':
          attribute.value = (input.value === '') ? null : attribute.coerce(input.value);
          if (attribute.value != null) {
            var mm = attribute.value.getMonth() + 1;
            var dd = attribute.value.getDate();
            var yyyy = attribute.value.getFullYear();
            if (mm < 10) mm = '0' + mm;
            if (dd < 10) dd = '0' + dd;
            input.value = mm + '/' + dd + '/' + yyyy;
          } else {
            input.value = '';
          }
          break;
        default:
          attribute.value = (input.value === '') ? null : attribute.coerce(input.value);
          if (attribute.value != null)
            input.value = attribute.value;
          break;
      }
      attribute.validate(function () {
      });
    };
    /**
     * Validate when focus lost
     */
    $(input).on('focusout', validateInput);
    panel.listeners.push(input); // so we can avoid leakage on deleting panel

    /**
     * Monitor state changes to attribute
     */
    attribute.onEvent('Validate', function () {
      attribute._validationDone = true;
    });
    attribute.onEvent('StateChange', function () {
      switch (mode + attribute.type) {
        case 'EditBoolean':
          if (( attribute.value ? true : false ) != input.checked)
            $(input).click();
          break;
        case 'EditDate':
          input.value = attribute.value ? '' + (1 + attribute.value.getMonth()) + '/' + attribute.value.getDate() + '/' + attribute.value.getFullYear() : '';
          break;
        case 'EditNumber':
          input.value = attribute.value ? attribute.value : 0;
          break;
        case 'EditString':
          input.value = attribute.value ? '' + attribute.value : '';
          break;
        case 'ViewDate':
          input.innerHTML = attribute.value ? '' + (1 + attribute.value.getMonth()) + '/' + attribute.value.getDate() + '/' + attribute.value.getFullYear() : '';
          break;
        default: // View String
          input.innerHTML = attribute.value;
          break;
      }
      renderHelpText(attribute._validationDone ? attribute.validationMessage : '');
      attribute._validationDone = false;
    });
    panel.attributeListeners.push(attribute); // so we can avoid leakage on deleting panel

    /**
     * For attribute error display
     */
    function renderHelpText(text) {
      if (text) {
        if (!helpTextDiv) {
          helpTextDiv = document.createElement("div");
          helpTextDiv.className = 'col-sm-9 col-sm-offset-3 has-error';
          formGroup.appendChild(helpTextDiv);
        }
        helpTextDiv.innerHTML = '<span style="display: block;" class="help-block">' + text + '</span>';
        $(formGroup).addClass('has-error');
        if (inputGroupButton)
          $(inputGroupButton).addClass('btn-danger');
      } else {
        setTimeout(function () {
          if (helpTextDiv) {
            $(helpTextDiv).remove();
            helpTextDiv = null;
          }
        }, 250);
        $(formGroup).removeClass('has-error');
        if (inputGroupButton)
          $(inputGroupButton).removeClass('btn-danger');
      }
    }
  }

  /**
   * function to render List
   */
  function renderList(list, theme) {


    var txtDiv = document.createElement("table");
    txtDiv.className = 'table table-condensed table-bordered table-hover-' + theme;
    //onsen2Interface.info(txtDiv.className);

    /**
     * Header
     */
    var tHead = addEle(txtDiv, 'thead');
    var tHeadRow = addEle(tHead, 'tr');
    for (j = 1; j < list.model.attributes.length; j++) { // skip id (0))
      var hAttribute = list.model.attributes[j];
      if (hAttribute.hidden == undefined)
        addEle(tHeadRow, 'th').innerHTML = hAttribute.label;
    }

    /**
     * Now each row in list
     */
    var gotData = list.moveFirst();
    var tBody = addEle(txtDiv, 'tbody');
    while (gotData) {
      var tBodyRow = addEle(tBody, 'tr');
      var idAttribute = list.model.attributes[0];
      $(tBodyRow).data("id", list.get(idAttribute.name));
      $(tBodyRow).click(function (e) {
        // onsen2Interface.dispatch(new Request({type: 'Command', command: action}));
        // onsen2Interface.info('you picked #' + $(e.currentTarget).data("id"));
        if (list.pickKludge)
          list.pickKludge($(e.currentTarget).data("id")); // too shitty balls
        e.preventDefault();
      });

      for (j = 1; j < list.model.attributes.length; j++) { // skip id (0))
        var dAttribute = list.model.attributes[j];
        if (dAttribute.hidden == undefined) {
          var dValue = list.get(dAttribute.name);
          switch (dAttribute.type) {
            case 'Date':
              //console.log('dValue=' + dValue);
              // addEle(tBodyRow, 'td').innerHTML = left(dValue.toISOString(), 10);
              // addEle(tBodyRow, 'td').innerHTML = dValue.toString(); // todo use moment.js
              if (dValue)
                addEle(tBodyRow, 'td').innerHTML = left(dValue.toISOString(), 10);
              else
                addEle(tBodyRow, 'td').innerHTML = '&nbsp;';
              break;
            case 'Boolean':
              if (dValue)
                addEle(tBodyRow, 'td').innerHTML = '<i class="fa fa-check-square-o"></i>';
              else
                addEle(tBodyRow, 'td').innerHTML = '<i class="fa fa-square-o"></i>';
              break;
            default:
              if (dValue && dValue.name) // todo instanceof Attribute.ModelID did not work so kludge here
                addEle(tBodyRow, 'td').innerHTML = dValue.name;
              else
                addEle(tBodyRow, 'td').innerHTML = dValue;
          }
        }
      }
      gotData = list.moveNext();
    }
    panel.panelForm.appendChild(txtDiv);

  }

  /**
   * function to render Command
   */
  function renderCommand(command) {

    if (!panel.buttonDiv) {
      var formGroup = addEle(panel.panelForm, 'div', 'form-group');
      panel.buttonDiv = addEle(formGroup, 'div', indent ? 'col-sm-offset-3 col-sm-9' : 'col-sm-9');
    }
    var cmdTheme = command.theme || 'default';
    var button = addEle(panel.buttonDiv, 'button', 'btn btn-' + cmdTheme + ' btn-presentation', {type: 'button'});

    var icon = command.icon;
    if (icon) {
      if (left(icon, 2) == 'fa')
        icon = '<i class="fa ' + icon + '"></i>&nbsp;';
      else
        icon = '<span class="glyphicon ' + icon + '"></span>&nbsp;';
      button.innerHTML = icon + command.name;
    } else {
      button.innerHTML = command.name;
    }

    $(button).on('click', function (event) {
      event.preventDefault();
      onsen2Interface.dispatch(new Request({type: 'Command', command: command}));
    });
    panel.listeners.push(button); // so we can avoid leakage on deleting panel
  }
};
