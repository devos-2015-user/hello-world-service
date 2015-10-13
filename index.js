var express = require('express');

var SERVICE_PORT = process.env.SERVICE_PORT || 3000;
var SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || (10000);

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});

var server = app.listen(SERVICE_PORT);

console.log('Service listening on port ' + SERVICE_PORT + ' ...');




////////////// GRACEFUL SHUTDOWN CODE ////

var gracefulShutdown = function () {
  console.log('Received kill signal, shutting down gracefully.');
  server.close(function () {
    console.log('Closed out remaining connections.');
    process.exit();
  });

  setTimeout(function () {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, SHUTDOWN_TIMEOUT);
};

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);
