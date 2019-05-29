/**---------------------------------------------------------------------------------------------------------------------
 * tgi-interface-onsen2/server-play.js
 */

// Initialize connect
var connect = require('connect');
var app = connect();
app.use(connect.static('play'));
// app.use(connect.directory('play', {icons: true}));
app.use(connect.directory(__dirname + '/play', {
  icons: true, filter: function (fname) {
    if (fname.indexOf('.css') === -1 && fname.indexOf('.js') === -1)
      return fname;
  }
}));

app.use('/dist',connect.static('dist'));

var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
var k, k2;
for (k in interfaces) {
  for (k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family == 'IPv4' && !address.internal) {
      addresses.push(address.address)
    }
  }
}

// Start up HTTP server (http)
var IP = addresses[0];
var Port = 8080;
var http = require('http').createServer(app);
var server = http.listen(Port, function () {
  console.log('Paste this in your browser and smoke it:\n' +
    'http://' + IP + ':' + Port + '');
});

