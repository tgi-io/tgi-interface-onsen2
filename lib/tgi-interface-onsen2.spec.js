/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/lib/tgi-interface-onsen2.spec.js
 */

spec.testSection('Interfaces');
spec.test('tgi-core/lib/interfaces/tgi-core-interfaces-repl.spec.js', 'Onsen2Interface', 'Onsen2 Interface', function (callback) {
  var coreTests = spec.mute(false);
  spec.heading('Onsen2Interface', function () {
    spec.paragraph('The Onsen2Interface uses  Onsen2 (http://www.idangero.us/onsen2) to create a IOS 7+ type of UI.');
    spec.paragraph('Core tests run: ' + JSON.stringify(coreTests));
    spec.paragraph('This doc may be outdated since tests run in browser.  See source code for more info.');
    spec.heading('CONSTRUCTOR', function () {
      spec.runnerInterfaceConstructor(Onsen2Interface);
      spec.example('must supply vendor in constructor', Error('Error initializing Onsen2'), function () {
        new Onsen2Interface().start(new Application(), new Presentation(), function () {
        });
      });
    });
    spec.runnerInterfaceMethods(Onsen2Interface);
    spec.heading('METHODS', function () {
      spec.paragraph('meh');
    });
    spec.heading('INTEGRATION', function () {
      spec.paragraph('blah');
    });
  });
});
