/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/lib/tgi-interface-onsen2-navigation.source.js
 */
Onsen2Interface.prototype.htmlNavigation = function () {
  const addEle = Onsen2Interface.addEle;
  this.doc.sideMenu = addEle(this.doc.mainContainer, 'ons-splitter-side', undefined,
    {id: 'menu', swipeable: '', collapse: '', width: '220px'});
  this.doc.ssPage = addEle(this.doc.sideMenu, 'ons-page');
  this.doc.ssList = addEle(this.doc.ssPage, 'ons-list');

  this.doc.ssNav = addEle(this.doc.mainContainer, 'ons-navigator', undefined, {id: 'navigator'});
  this.doc.ssNavPage = addEle(this.doc.ssNav, 'ons-page');
  this.refreshNavigation();
};
Onsen2Interface.prototype.refreshNavigation = function () {
  const addEle = Onsen2Interface.addEle;

  this.doc.ssList.innerHTML = ''; // remove any child nodes
  const menuContents = this.presentation.get('contents');
  var separatorSeen = false;
  for (var menuItem in menuContents) {
    if (menuContents.hasOwnProperty(menuItem)) {
      if (false && menuContents[menuItem].type === 'Menu') {
        // let parentMenu = this.addNavBarListMenu(this.doc.navBarLeft, menuContents[menuItem]);
        // let subMenu = menuContents[menuItem].contents;
        // for (let subPres in subMenu)
        //   if (subMenu.hasOwnProperty(subPres))
        //     this.addNavBarListItem(parentMenu, subMenu[subPres]);
      } else {
        if (menuContents[menuItem] === '-')
          addEle(this.doc.ssList, 'HR'); // todo make menu on right
        else
          this.addNavigationItem(this.doc.ssList, menuContents[menuItem]);
        // if (menuContents[menuItem] === '-')
        //   separatorSeen = true;
        // else
        //   this.addNavigationItem((separatorSeen ? this.doc.navBarRight : this.doc.navBarLeft), menuContents[menuItem]);
      }
    }
  }
};
Onsen2Interface.prototype.addNavigationItem = function (parent, action) {
  const addEle = Onsen2Interface.addEle;

  this.doc.ssListItem = addEle(this.doc.ssList, 'ons-list-item',undefined,{modifier:"nodivider"});

  var icon = '<ons-icon style="opacity: 0.1" fixed-width class="list-item__icon" icon="fa-genderless" size="16px"></ons-icon>';
  icon = '<ons-icon fixed-width class="list-item__icon" size="16px">˙</ons-icon>';

  if (action.icon) {
    if (left(action.icon, 2) === 'fa')
      icon = '<ons-icon fixed-width class="list-item__icon" icon="' +
        action.icon + '"' +
        ' size="16px"></ons-icon>';
  }

  this.doc.ssListItem.innerHTML = '<div class="left">' +
    icon +
    // '</div><div class="center">' +
    action.name +
    '</div>'


  // var onsen2Interface = this;
  // var listItem = Onsen2Interface.addEle(parent, 'li');
  // var icon = '';
  // var theme = action.theme || 'default';
  // if (action.icon) {
  //   if (left(action.icon, 2) == 'fa')
  //     icon = '<i class="fa ' + action.icon + '"></i>&nbsp;';
  //   else
  //     icon = '<span class="glyphicon ' + action.icon + '"></span>&nbsp;';
  // }
  // listItem.innerHTML = '<button type="button" class="btn btn-' + theme + ' navbar-btn">' + icon + action.name + '</button>';
  // $(listItem).click(function (e) {
  //   onsen2Interface.dispatch(new Request({type: 'Command', command: action}));
  //   e.preventDefault();
  // });
};
Onsen2Interface.prototype.addNavBarListItem = function (parent, action, icon) {
  var self = this;
  var html;
  var listItem = document.createElement('li');
  icon = icon || '';
  if (action instanceof Command) {
    html = '<a>' + icon + action.name + '</a>';
    $(listItem).click(function (e) {
      self.dispatch(new Request({type: 'Command', command: action}));
      e.preventDefault();
    });
  } else {
    if (action == '-') {
      listItem.className = 'divider';
    } else {
      listItem.className = 'dropdown-header';
      html = action;
    }
  }
  listItem.innerHTML = html;
  parent.appendChild(listItem);
};
Onsen2Interface.prototype.addNavBarListMenu = function (parent, action) {

  var icon = '';
  var theme = action.theme || 'default';
  if (action.icon) {
    if (left(action.icon, 2) == 'fa')
      icon = '<i class="fa ' + action.icon + '"></i>&nbsp;';
    else
      icon = '<span class="glyphicon ' + action.icon + '"></span>&nbsp;';
  }

  var dropDown = document.createElement('li');
  dropDown.className = "dropdown";
  dropDown.innerHTML = '<button type="button" class="dropdown-toggle btn btn-' + theme + ' navbar-btn" data-toggle="dropdown">' + icon + action.name + '&nbsp;<b class="caret"></b></button>';
  parent.appendChild(dropDown);

  var dropDownMenu = document.createElement('ul');
  dropDownMenu.className = "dropdown-menu";
  dropDown.appendChild(dropDownMenu);

  return dropDownMenu;
};