/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/lib/tgi-interface-onsen2-queries.source.js
 */

/**
 * Called at startup for initial html
 */
Onsen2Interface.prototype.htmlDialog = function () {
  var onsen2Interface = this;
  var addEle = Onsen2Interface.addEle;
};
Onsen2Interface.prototype.info = function (text) {
  ons.notification.toast('<b><u>Information</b></u></br>' + text, {timeout: 2000});
};
Onsen2Interface.prototype.done = function (text) {
  ons.notification.toast('<b><u>Done</b></u></br>' + text, {timeout: 2000});
};
Onsen2Interface.prototype.warn = function (text) {
  ons.notification.toast('<b><u>WARNING</b></u></br>' + text, {timeout: 2000});
};
Onsen2Interface.prototype.err = function (text) {
  ons.notification.toast('<b><u>ERROR</b></u></br>' + text, {timeout: 2000});
};
Onsen2Interface.prototype.ok = function (prompt, callback) {
  ons.notification.alert(prompt, {callback: callback});
};
Onsen2Interface.prototype.yesno = function (prompt, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (typeof callback != 'function') throw new Error('callback required');
  ons.notification.confirm(prompt, {buttonLabels: ['No', 'Yes']})
    .then(function (input) {
      callback(input);
    });
};
Onsen2Interface.prototype.ask = function (prompt, attribute, callback) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (attribute instanceof Attribute)) throw new Error('attribute or callback expected');
  if (typeof callback != 'function') throw new Error('callback required');
  ons.notification.prompt(prompt, {defaultValue: attribute.value})
    .then(function (input) {
      callback(input);
    });
};
Onsen2Interface.prototype.choose = function (prompt, choices, callback) {
  console.log('choose: ' + prompt);
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt required');
  if (false === (choices instanceof Array)) throw new Error('choices array required');
  if (!choices.length) throw new Error('choices array empty');
  if (typeof callback != 'function') throw new Error('callback required');

  var myChoices = [];
  for (var choice in choices) {
    myChoices.push(choices[choice]);
  }
  var cancelChoice = myChoices.push({label: 'Cancel', icon: 'md-close'})-1;

  var menu = {
    title: prompt,
    cancelable: true,
    buttons: myChoices
  };
  ons.openActionSheet(menu)
    .then(function (index) {
      if (index<0 || index == cancelChoice)
        callback();
      else
        callback(myChoices[index]);
    });

};
