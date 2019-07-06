/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/lib/tgi-interface-onsen2-panels.source.js
 */

/**
 * Called at startup for initial html
 */
Onsen2Interface.prototype.htmlPanels = function () {
  this.doc.mainContainer = Onsen2Interface.addEle(document.body, 'ons-splitter');
};

/**
 * activatePanel will create if needed, make panel visible and render contents
 */
Onsen2Interface.prototype.activatePanel = function (command) {
  var onsen2Interface = this;
  var presentation = command.contents;
  var name = presentation.get('name') || command.name;

  // onsen2Interface.panels array of panels
  if (typeof onsen2Interface.panels == 'undefined')
    onsen2Interface.panels = [];

  // See if command already has a panel
  var panel;
  for (var i = 0; (typeof panel == 'undefined') && i < onsen2Interface.panels.length; i++) {
    if (name === onsen2Interface.panels[i].name)
      panel = onsen2Interface.panels[i];
  }

  // If we did not find panel create
  if (typeof panel == 'undefined') {
    panel = {
      name: name,
      textListeners: [],
      attributeListeners: [],
      id: this.panels.length
    };
    this.panels.push(panel);
  }

  // Render panel body then show it
  onsen2Interface.renderPanelBody(panel, command);
  // document.querySelector('#menu').close();
  // document.querySelector('#navigator').resetToPage('panel' + panel.id + '.html');
};

/**
 * renderPanelBody will insert the html into the body of the panel for View presentation mode
 */
Onsen2Interface.prototype.renderPanelBody = function (panel, command) {
  console.log('Onsen2Interface.prototype.renderPanelBody');
  var onsen2Interface = this;
  var addEle = Onsen2Interface.addEle;
  var html = '';
  var i, ele;

  /**
   * Create panel template if it des not exist
   */
  if (!panel.template) {
    var pcname = pcname = 'pc' + panel.id;
    panel.template = document.createElement('template');
    panel.template.id = 'panel' + panel.id + '.html';
    panel.template.innerHTML = '<ons-page id="pg' + panel.id + '">' +
      '<ons-toolbar id="tb' + panel.id + '">' +
      '<div class="left"><ons-toolbar-button onclick="document.querySelector(\'#menu\').open()"><ons-icon icon="md-menu"></ons-icon></ons-toolbar-button></div>' +
      '<div class="center">' + panel.name + '</div>' +
      '</ons-toolbar>' +
      '<div id = "' + pcname + '"></div></ons-page>';
    document.body.appendChild(panel.template);
  }

  /**
   * Remove listeners from before before resetting contents
   */
  for (i = 0; i < panel.textListeners.length; i++) {
    ele = panel.textListeners[i];
    ele.offEvent();
  }
  for (i = 0; i < panel.attributeListeners.length; i++) {
    ele = panel.attributeListeners[i];
    ele.offEvent();
  }

  /**
   * Set Page Display
   */
  document.querySelector('#menu').close();
  document.querySelector('#navigator').resetToPage('panel' + panel.id + '.html')
    .then(function () {
      renderContents();
    });

  /**
   * function to render contents
   */
  function renderContents() {
    var i, j, indent = false;
    var onsList = addEle(document.getElementById('pc' + panel.id), 'ons-list');
    var contents = command.contents.get('contents');
    var uniqueID;
    var buttonDiv; // This will group contiguous commands
    var ele = null;
    for (i = 0; i < contents.length; i++) {
      // first if not button reset container for them
      if (!(ele instanceof Command)) buttonDiv = undefined;
      uniqueID = 'id' + panel.id + '_' + i;
      ele = contents[i];
      if (typeof ele == 'string')
        renderString(onsList, ele);
      else if (ele instanceof Text)
        renderText(onsList, ele);
      else if (ele instanceof Attribute)
        renderAttribute(onsList, ele, command.presentationMode);
      else if (ele instanceof List)
        renderList(onsList, ele, command.theme);
      else if (ele instanceof Command)
        renderCommand(onsList, ele);
    }

    function renderString(onsList, string) {
      switch (ele) {
        case '-':
          addEle(onsList, 'ons-list-header').innerHTML = '<br>';
          // html = html + '</ons-list><br><ons-list>';
          break;
        case '>':
          addEle(onsList, 'ons-list-header').innerHTML = 'indent = true;';
          indent = true;
          break;
        case '<':
          addEle(onsList, 'ons-list-header').innerHTML = 'indent = false;';
          indent = false;
          break;
        default:
          addEle(onsList, 'ons-list-item').innerHTML = marked(string);
          break;
      }
    }

    function renderText(onsList, text) {
      var listItem = addEle(addEle(onsList, 'ons-list-item'), 'div', 'card__content');
      listItem.innerHTML = marked(text.get());
      text.onEvent('StateChange', function () {
        listItem.innerHTML = marked(text.get());
      });
      panel.textListeners.push(text); // so we can avoid leakage on deleting panel
    }

    function renderAttribute(onsList, attribute, mode) {
      var input, centerContainer, leftContainer, rightContainer, listItem, button, daItems, daList;
      switch (mode + attribute.type) {
        case 'ViewDate':
          listItem = addEle(onsList, 'ons-list-item', 'input-items');
          leftContainer = addEle(listItem, 'div', 'left', {style: 'width: 96px', align: 'right'});
          leftContainer.innerHTML = '<label style="width: 96px; font-size:90%">' + attribute.label + '</label>&nbsp;&nbsp;';
          centerContainer = addEle(listItem, 'label', 'center');
          if (attribute.value)
            centerContainer.innerHTML = (1 + attribute.value.getMonth()) + '/' + attribute.value.getDate() + '/' + attribute.value.getFullYear();
          break;
        case 'ViewNumber':
        case 'ViewString':
          listItem = addEle(onsList, 'ons-list-item', 'input-items');
          leftContainer = addEle(listItem, 'div', 'left', {style: 'width: 96px', align: 'right'});
          leftContainer.innerHTML = '<label style="width: 96px; font-size:90%">' + attribute.label + '</label>&nbsp;&nbsp;';
          centerContainer = addEle(listItem, 'label', 'center');
          if (attribute.value)
            centerContainer.innerHTML = attribute.value;
          break;
        case 'EditBoolean':
        case 'ViewBoolean':
          listItem = addEle(onsList, 'ons-list-item', 'input-items');
          leftContainer = addEle(listItem, 'div', 'left', {style: 'width: 96px', align: 'right'});
          leftContainer.innerHTML = '<label style="width: 96px; font-size:90%">' + attribute.label + '</label>&nbsp;&nbsp;';
          centerContainer = addEle(listItem, 'div', 'center');
          if (attribute.value)
            centerContainer.innerHTML = '<ons-switch ' + (mode === 'Edit' ? '' : 'disabled') + ' checked="true"></ons-switch>';
          else
            centerContainer.innerHTML = '<ons-switch ' + (mode === 'Edit' ? '' : 'disabled') + '></ons-switch>';
          break;
        case 'EditString':
          listItem = addEle(onsList, 'ons-list-item', 'input-items');
          leftContainer = addEle(listItem, 'div', 'left', {style: 'width: 96px', align: 'right'});
          leftContainer.innerHTML = '<label style="width: 96px; font-size:90%">' + attribute.label + '</label>&nbsp;&nbsp;';
          centerContainer = addEle(listItem, 'label', 'center');
          input = addEle(centerContainer, 'ons-input', undefined, {
            id: uniqueID,
            maxLength: attribute.size,
            type: attribute.hint.password ? "password" : "text"
          });
          if (attribute.placeHolder)
            input.setAttribute("placeHolder", attribute.placeHolder);
          if (attribute.value)
            input.value = attribute.value;
          if (attribute.quickPick) {
            rightContainer = addEle(listItem, 'div', 'right');
            button = addEle(rightContainer, 'ons-toolbar-button');
            button.innerHTML = '<ons-icon icon="fa-caret-down"></ons-icon>';
            button.addEventListener('click', function (event) {
              daList = [];
              daItems = attribute.quickPick;
              for (j = 0; j < daItems.length; j++) {
                daList.push(daItems[j]);
              }
              daList.push({label: 'Cancel', icon: 'md-close'});
              ons.openActionSheet({
                title: attribute.label,
                cancelable: true,
                buttons: daList
              }).then(function (index) {
                if (index < daItems.length)
                  input.value = daItems[index];
              });
            });
          }
          break;
        case 'EditNumber':
          listItem = addEle(onsList, 'ons-list-item', 'input-items');
          leftContainer = addEle(listItem, 'div', 'left', {style: 'width: 96px', align: 'right'});
          leftContainer.innerHTML = '<label style="width: 96px; font-size:90%">' + attribute.label + '</label>&nbsp;&nbsp;';
          centerContainer = addEle(listItem, 'label', 'center');
          input = addEle(centerContainer, 'ons-input', undefined, {
            id: uniqueID,
            maxLength: attribute.size,
            type: "number"
          });
          if (attribute.placeHolder)
            input.setAttribute("placeHolder", attribute.placeHolder);
          if (attribute.value)
            input.value = attribute.value;
          break;
        case 'EditDate':
          listItem = addEle(onsList, 'ons-list-item', 'input-items');
          leftContainer = addEle(listItem, 'div', 'left', {style: 'width: 96px', align: 'right'});
          leftContainer.innerHTML = '<label style="width: 96px; font-size:90%">' + attribute.label + '</label>&nbsp;&nbsp;';
          centerContainer = addEle(listItem, 'label', 'center');
          input = addEle(centerContainer, 'ons-input', undefined, {
            id: uniqueID,
            type: "date",
            style: "min-width:95%"
          });
          if (attribute.placeHolder)
            input.setAttribute("placeHolder", attribute.placeHolder);
          if (attribute.value)
            input.value = attribute.value;
          break;
        default:
          listItem = addEle(onsList, 'ons-list-item', 'input-items');
          leftContainer = addEle(listItem, 'div', 'left', {style: 'width: 96px', align: 'right'});
          leftContainer.innerHTML = '<label style="width: 96px; font-size:90%">' + attribute.label + '</label>&nbsp;&nbsp;';
          centerContainer = addEle(listItem, 'label', 'center');
          centerContainer.innerHTML = 'default: ' + mode + attribute.type;
      }

      /**
       * Monitor state changes to attribute
       */
      attribute.onEvent('Validate', function () {
        attribute._validationDone = true;
      });
      attribute.onEvent('StateChange', function () {
        switch (mode + attribute.type) {
          case 'EditBoolean':
          case 'ViewBoolean':
            if (attribute.value)
              centerContainer.innerHTML = '<ons-switch ' + (mode === 'Edit' ? '' : 'disabled') + ' checked="true"></ons-switch>';
            else
              centerContainer.innerHTML = '<ons-switch ' + (mode === 'Edit' ? '' : 'disabled') + '></ons-switch>';
            break;
          case 'EditDate':
            input.value = attribute.value;

            break;
          case 'EditNumber':
            input.value = attribute.value ? attribute.value : 0;
            break;
          case 'EditString':
            input.value = attribute.value ? '' + attribute.value : '';
            break;
          case 'ViewDate':
            centerContainer.innerHTML = attribute.value ? '' + (1 + attribute.value.getMonth()) + '/' + attribute.value.getDate() + '/' + attribute.value.getFullYear() : '';
            break;
          default: // View String
            centerContainer.innerHTML = attribute.value;
            break;
        }

      });
      panel.attributeListeners.push(attribute); // so we can avoid leakage on deleting panel
    }

    function renderList(onsList, list, theme) {

      // var strVal = '';
      // for (j = 1; j < list.model.attributes.length; j++) { // skip id (0))
      //   var hAttribute = list.model.attributes[j];
      //   if (hAttribute.hidden == undefined)
      //     strVal += (hAttribute.label + '<br>');
      // }
      // listItem.innerHTML = strVal ;


      var gotData = list.moveFirst();
      // var tBody = addEle(txtDiv, 'tbody');
      while (gotData) {
        var strVal = '';
        var card = addEle(onsList, 'ons-card');
        var cardContent = addEle(card, 'div', 'content');
        var cardList = addEle(cardContent, 'ons-list', undefined, {modifier: 'noborder'});
        var idAttribute = list.model.attributes[0];
        card.dataset.id = list.get(idAttribute.name);
        card.addEventListener('click', function (event) {
          console.log('event.currentTarget: ' + event.currentTarget);
          if (list.pickKludge)
            list.pickKludge(event.currentTarget.dataset.id);
        });

        for (j = 1; j < list.model.attributes.length; j++) { // skip id (0))
          var dAttribute = list.model.attributes[j];
          if (dAttribute.hidden === undefined) {
            var dValue = list.get(dAttribute.name);
            var dText = '' + dValue;
            switch (dAttribute.type) {
              case 'Date':
                if (dValue)
                  dText = left(dValue.toISOString(), 10);
                else
                  dText = '&nbsp;';
                break;
              case 'Boolean':
                //  var icon = '<ons-icon style="opacity: 0.25" fixed-width class="list-item__icon" icon="fa-minus" size="16px"></ons-icon>';
                if (dValue)
                  dText = '<div style="font-weight:bold; font-size: larger">☐</div>';
                else
                  dText = '<div style="font-weight:bold; font-size: larger">☑</div>';
                break;
            }


            var dRow = addEle(cardList, 'ons-row');
            var dCol1 = '<ons-col class="list-card-col" align="right" width="25%"><b>' + dAttribute.label + '</b></ons-col>';
            var dCol2 = '<ons-col width="2.5%"></ons-col>';
            var dCol3 = '<ons-col class="list-card-col">' + dText + '</ons-col>';
            if (j===1) {
              dCol3 = '<ons-col class="list-card-col1st">' + dText + '</ons-col>';
            }


            dRow.innerHTML = dCol1 + dCol2 + dCol3;


            // switch (dAttribute.type) {
            //   case 'Date':
            //     //console.log('dValue=' + dValue);
            //     // addEle(tBodyRow, 'td').innerHTML = left(dValue.toISOString(), 10);
            //     // addEle(tBodyRow, 'td').innerHTML = dValue.toString(); // todo use moment.js
            //     if (dValue)
            //       addEle(tBodyRow, 'td').innerHTML = left(dValue.toISOString(), 10);
            //     else
            //       addEle(tBodyRow, 'td').innerHTML = '&nbsp;';
            //     break;
            //   case 'Boolean':
            //     if (dValue)
            //       addEle(tBodyRow, 'td').innerHTML = '<i class="fa fa-check-square-o"></i>';
            //     else
            //       addEle(tBodyRow, 'td').innerHTML = '<i class="fa fa-square-o"></i>';
            //     break;
            //   default:
            //     if (dValue && dValue.name) // todo instanceof Attribute.ModelID did not work so kludge here
            //       strVal += ('' + dValue.name + '<br>'); // addEle(tBodyRow, 'td').innerHTML = dValue.name;
            //     else
            //       strVal += ('' + dValue + '<br>'); // addEle(tBodyRow, 'td').innerHTML = dValue;
            // }

          }
        }
        // cardContent.innerHTML = strVal;
        gotData = list.moveNext();

      }

      return;
      {
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
    }

    function renderCommand(onsList, command) {
      var section;
      if (!buttonDiv) { // If no button container create
        indent = false;
        if (indent) {
          section = addEle(onsList, 'ons-list-item', 'input-items');
          // section = addEle(onsList, 'section', undefined, {style: "padding: 16px"});
          buttonDiv = addEle(section, 'div', 'right');
        } else {
          section = addEle(onsList, 'section', undefined, {style: "padding: 16px"});
          buttonDiv = addEle(section, 'div', undefined, {style: "text-align:left"});
        }

      }
      var button = addEle(buttonDiv, 'ons-button', undefined, {
        id: uniqueID,
        modifier: 'large',
        style: "margin: 8px;fixed-width: 100px"
      });
      button.innerText = command.name;
      button.addEventListener('click', function (event) {
        onsen2Interface.dispatch(new Request({type: 'Command', command: command}));
      });
      return;
      {
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
    }
  }

};
