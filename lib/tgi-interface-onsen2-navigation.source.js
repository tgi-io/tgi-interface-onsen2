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
      if (menuContents[menuItem].type === 'Menu') {
        var parentMenu = this.addNavBarListMenu(this.doc.ssList, menuContents[menuItem]);
        var subMenu = menuContents[menuItem].contents;
        for (var subPres in subMenu)
          if (subMenu.hasOwnProperty(subPres))
            this.addNavBarListItem(parentMenu, subMenu[subPres]);
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
  console.log('addNavigationItem: '  + action.name);
  const addEle = Onsen2Interface.addEle;
  var ssListItem = addEle(this.doc.ssList, 'ons-list-item',undefined,{modifier:"nodivider"});
  var icon = '<ons-icon style="opacity: 0.25" fixed-width class="list-item__icon" icon="fa-minus" size="16px"></ons-icon>';
  if (action.icon) {
    if (left(action.icon, 2) === 'fa')
      icon = '<ons-icon fixed-width class="list-item__icon" icon="' +
        action.icon + '"' +
        ' size="16px"></ons-icon>';
  }
  ssListItem.innerHTML = '<div class="left">' + icon + action.name +'</div>'
};
Onsen2Interface.prototype.addNavBarListItem = function (parent, action) {
  console.log('addNavBarListItem: '  + action.name);
  const addEle = Onsen2Interface.addEle;
  if (typeof action !== 'string') {
    var ssListItem = addEle(parent, 'ons-list-item',undefined,{modifier:"nodivider"});
    var icon = '<ons-icon style="opacity: 0.25" fixed-width class="list-item__icon" icon="fa-minus" size="16px"></ons-icon>';
    if (action.icon && left(action.icon, 2) === 'fa')
      icon = '<ons-icon fixed-width class="list-item__icon" icon="' + action.icon + '"' + ' size="16px"></ons-icon>';
    ssListItem.innerHTML = '<div class="left">' + icon + action.name + '</div>';
  }
};
Onsen2Interface.prototype.addNavBarListMenu = function (parent, action) {
  console.log('addNavBarListMenu: '  + action.name);
  const addEle = Onsen2Interface.addEle;
  var ssListItem = addEle(this.doc.ssList, 'ons-list-item',undefined,{expandable:'',modifier:"nodivider"});
  var icon = '<ons-icon style="opacity: 0.25" fixed-width class="list-item__icon" icon="fa-bars" size="16px"></ons-icon>';
  if (action.icon && left(action.icon, 2) === 'fa')
      icon = '<ons-icon fixed-width class="list-item__icon" icon="' + action.icon + '"' + ' size="16px"></ons-icon>';
  ssListItem.innerHTML = '<div class="left">' + icon + action.name + '</div>';
  return addEle(ssListItem, 'div', 'expandable-content');
};