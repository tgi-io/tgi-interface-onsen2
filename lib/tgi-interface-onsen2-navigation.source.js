/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/lib/tgi-interface-onsen2-navigation.source.js
 */
Onsen2Interface.prototype.htmlNavigation = function () {
  var onsen2Interface = this;
  onsen2Interface.navCommands = [];
  const addEle = Onsen2Interface.addEle;

  this.doc.sideMenuLeft = addEle(this.doc.mainContainer, 'ons-splitter-side', undefined, {id: 'menuLeft', swipeable: '', collapse: '', width: '220px'});
  this.doc.ssPageLeft = addEle(this.doc.sideMenuLeft, 'ons-page');
  this.doc.ssListLeft = addEle(this.doc.ssPageLeft, 'ons-list');

  this.doc.sideMenuRight = addEle(this.doc.mainContainer, 'ons-splitter-side', undefined, {id: 'menuRight', swipeable: '', collapse: '', side: 'right', width: '220px'});
  this.doc.ssPageRight = addEle(this.doc.sideMenuRight, 'ons-page');
  this.doc.ssListRight = addEle(this.doc.ssPageRight, 'ons-list');

  this.doc.ssNav = addEle(this.doc.mainContainer, 'ons-navigator', undefined, {id: 'navigator'});
  this.doc.ssNavPage = addEle(this.doc.ssNav, 'ons-page');
  this.refreshNavigation();
};
Onsen2Interface.prototype.refreshNavigation = function () {
  const addEle = Onsen2Interface.addEle;

  this.doc.ssListLeft.innerHTML = '';
  this.doc.ssListRight.innerHTML = '';

  const menuContents = this.presentation.get('contents');
  var separatorSeen = false;

  for (var menuItem in menuContents) {
    if (menuContents.hasOwnProperty(menuItem)) {
      if (menuContents[menuItem].type === 'Menu') {
        var parentMenu = this.addNavBarListMenu(this.doc.ssListLeft, menuContents[menuItem]);
        var subMenu = menuContents[menuItem].contents;
        for (var subPres in subMenu)
          if (subMenu.hasOwnProperty(subPres))
            this.addNavBarListItem(parentMenu, subMenu[subPres]);
      } else {
        if (menuContents[menuItem] === '-') {
          separatorSeen = true;
          console.log('separatorSeen = true;');
        } else {
          if (separatorSeen) {
            this.addNavigationItem(this.doc.ssListRight, menuContents[menuItem]);
          }

          else
            this.addNavigationItem(this.doc.ssListLeft, menuContents[menuItem]);
        }
      }
    }
  }
};
Onsen2Interface.prototype.addNavigationItem = function (parent, action) {
  var onsen2Interface = this;
  var navIndex = onsen2Interface.navIndex(action);
  // console.log('addNavigationItem ' + navIndex);

  const addEle = Onsen2Interface.addEle;
  var ssListItem = addEle(parent, 'ons-list-item', undefined, {
    modifier: "nodivider",
    onclick: "app.primaryInterface.nav(" + navIndex + ")"
  });
  var icon = '<ons-icon style="opacity: 0.25" fixed-width class="list-item__icon" icon="fa-minus" size="16px"></ons-icon>';
  if (action.icon) {
    if (left(action.icon, 2) === 'fa')
      icon = '<ons-icon fixed-width class="list-item__icon" icon="' +
        action.icon + '"' +
        ' size="16px"></ons-icon>';
  }
  ssListItem.innerHTML = '<div class="left">' + icon + action.name + '</div>'
};
Onsen2Interface.prototype.addNavBarListItem = function (parent, action) {
  var onsen2Interface = this;

  const addEle = Onsen2Interface.addEle;
  if (typeof action !== 'string') {
    var navIndex = onsen2Interface.navIndex(action);
    // console.log('addNavBarListItem ' + navIndex);
    var ssListItem = addEle(parent, 'ons-list-item', undefined, {
      modifier: "nodivider",
      onclick: "app.primaryInterface.nav(" + navIndex + ")"
    });
    var icon = '<ons-icon style="opacity: 0.25" fixed-width class="list-item__icon" icon="fa-minus" size="16px"></ons-icon>';
    if (action.icon && left(action.icon, 2) === 'fa')
      icon = '<ons-icon fixed-width class="list-item__icon" icon="' + action.icon + '"' + ' size="16px"></ons-icon>';
    ssListItem.innerHTML = '<div class="left">' + icon + action.name + '</div>';
  }
};
Onsen2Interface.prototype.addNavBarListMenu = function (parent, action) {
  const addEle = Onsen2Interface.addEle;
  var ssListItem = addEle(this.doc.ssListLeft, 'ons-list-item', undefined, {expandable: '', modifier: "nodivider"});
  var icon = '<ons-icon style="opacity: 0.25" fixed-width class="list-item__icon" icon="fa-bars" size="16px"></ons-icon>';
  if (action.icon && left(action.icon, 2) === 'fa')
    icon = '<ons-icon fixed-width class="list-item__icon" icon="' + action.icon + '"' + ' size="16px"></ons-icon>';
  ssListItem.innerHTML = '<div class="left">' + icon + action.name + '</div>';
  return addEle(ssListItem, 'div', 'expandable-content');
};
Onsen2Interface.prototype.nav = function (index) {
  var onsen2Interface = this;
  var action = onsen2Interface.navCommands[index];
  // console.log('Onsen2Interface.prototype.nav: ' + index + ' - ' + action.name);
  app.primaryInterface.dispatch(new Request({type: 'Command', command: action}));
};
Onsen2Interface.prototype.navIndex = function (action) {
  var onsen2Interface = this;
  var index = onsen2Interface.navCommands.push(action) - 1;
  // console.log('Onsen2Interface.prototype.navIndex: ' + index + ' - ' + action.name);
  return index;
};