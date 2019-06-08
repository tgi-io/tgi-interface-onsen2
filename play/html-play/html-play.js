/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/test/html-play.js
 **/
const tgi = TGI.CORE();
const bs = new (TGI.INTERFACE.ONSEN2().Onsen2Interface)({vendor: Date}); // no vendor function TODO wtf
const app = new tgi.Application({interface: bs});
const nav = new tgi.Presentation();
app.setInterface(bs);
app.set('brand', 'HTML Play');
app.setPresentation(nav);

/**
 * Commands
 */
let name,
  isDude,
  color;
const userQueryCommand = new tgi.Command({
  name: 'User Queries', type: 'Procedure', contents: new tgi.Procedure({
    tasks: [
      function () {
        var task = this;
        app.ask('What is first your name?', new tgi.Attribute({name: 'name', value: 'John Doe'}), function (reply) {
          if (!reply)
            userQueryCommand.abort();
          else {
            name = reply;
            task.complete();
          }
        });
      },
      function () {
        var task = this;
        app.yesno(name + ' are you a dude?', function (reply) {
          isDude = reply;
          task.complete();
        });
      },
      function () {
        var task = this;
        app.choose('OK ' + (isDude ? 'mr. ' : 'ms. ') + name + ', please pick a color.\nany color..\n\nplease pick one now', ['red', 'green', 'blue', 'black', 'white'], function (choice) {
          if (!choice)
            userQueryCommand.abort();
          else {
            color = choice;
            task.complete();
          }
        });
      },
      function () {
        var task = this;
        app.ok(name + ' is a ' + color + (isDude ? ' dude.' : ' chick.') + '\n\n*** THE END ***', function () {
          task.complete();
        });
      }
    ]
  })
});
userQueryCommand.onEvent('*', function (event) {
  if (event == 'Aborted') {
    app.info('ok fine be that way');
  }
});
// Create a function command
const funcCommand = new tgi.Command({
  name: 'Function', type: 'Function', contents: function () {
    window.alert("Hello! I am an alert box!!");
  }
});

// Create a procedure command
const procCommand = new tgi.Command({name: 'Procedure', type: 'Procedure', contents: new tgi.Procedure()});

// Stub commands
const stubMoe = new tgi.Command({name: 'Moe', description: 'Moses Horwitz', theme: 'primary', icon: 'fa-coffee'});
const stubLarry = new tgi.Command({name: 'Larry', description: 'Louis Fienberg', theme: 'info', icon: 'fa-beer'});
const stubCurly = new tgi.Command({name: 'Curly', description: 'Jerome Lester Horwitz', theme: 'warning', icon: 'fa-glass'});

// Create sample presentation
const pres = new tgi.Presentation();
pres.set('contents', [
  '####INSTRUCTIONS\n\n' +
  'Enter some stuff then push some buttons.',
  '-',
  new tgi.Attribute({name: 'firstName', label: 'First Name', type: 'String(20)', value: 'John'}),
  new tgi.Attribute({name: 'lastName', label: 'Last Name', type: 'String(25)', value: 'Doe'}),
  new tgi.Attribute({name: 'address', label: 'Address', type: 'String(50)'}),
  new tgi.Attribute({name: 'city', label: 'City', type: 'String(35)'}),
  new tgi.Attribute({name: 'state', label: 'State', type: 'String(2)'}),
  new tgi.Attribute({name: 'zip', label: 'Zip Code', type: 'String(10)', placeHolder: '#####-####'}),
  new tgi.Attribute({name: 'birthDate', label: 'Birth Date', type: 'Date', value: new Date()}),
  new tgi.Attribute({name: 'drink', type: 'String(25)', quickPick:['Water','Coke','Coffee']}),
  new tgi.Attribute({name: 'sex', type: 'Boolean', value: true}),
  new tgi.Attribute({name: 'drugs', type: 'Boolean', value: false}),
  new tgi.Attribute({name: 'IQ', type: 'Number', value: 100}),
  '-',
  funcCommand,
  procCommand,
  stubMoe,
  stubLarry,
  stubCurly

]);
const presCommand = new tgi.Command({name: 'Presentation', type: 'Presentation', contents: pres});
const commands = new tgi.Command({
  name: 'Commands', type: 'Menu', contents: [
    'Command Types',
    '-',
    new tgi.Command({name: 'Stub', type: 'Stub'}),
    presCommand,
    funcCommand,
    procCommand
  ]
});

/**
 * Navigation
 */
nav.set('contents', [
  new tgi.Command({name: 'Stooges', type: 'Menu', theme: 'info', icon: 'fa-info-circle', contents: [
    'The Three Stooges',
    '-',
    stubMoe,
    stubLarry,
    stubCurly
  ]}),
  commands,
  userQueryCommand,
  new tgi.Command({name: 'Info', type: 'Function', theme: 'info', icon: 'fa-info-circle', contents: function () {
    app.info('The current date and time is ' + new Date());
  }}),
  new tgi.Command({name: 'Done', type: 'Function', theme: 'success', icon: 'fa-check', contents: function () {
    app.done('Soups Done!');
  }}),
  new tgi.Command({name: 'Warning', type: 'Function', theme: 'warning', icon: 'fa-exclamation-circle', contents: function () {
    app.warn('Do not try this at home.');
  }}),
  new tgi.Command({name: 'Error', type: 'Function', theme: 'danger', icon: 'fa-exclamation-triangle', contents: function () {
    app.err('You broke it now!');
  }}),
  '-',
  new tgi.Command({name: 'Account'})
]);

/**
 * Start the app
 */
app.start(function (request) {
  app.info('' + request);
});
document.querySelector('#navigator').resetToPage('home.html');

