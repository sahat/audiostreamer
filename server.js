var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set('close timeout', 20);
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
  app.use(express.cookieParser());
  app.use(express.session({ secret: '42' }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

var clients = 0;

io.sockets.on('connection', function (socket) {
  clients++;
  io.sockets.emit('count', { numberOfClients: clients });
  io.sockets.emit('this', { will: 'be received by everyone'});

  socket.on('play', function(data) {
    console.log('play received');
    io.sockets.emit('start', 'go ahead and play');
  });

  socket.on('pause', function() {
     io.sockets.emit('halt', 'maestro stop playing!');
  });

  socket.on('disconnect', function() {
    clients--;
      io.sockets.emit('count', { numberOfClients: clients });
  });
});

app.get('/clients', function(req, res) {
   res.send(clients);
});

app.post('/fileupload', function(req, res) {
   console.log('received post request');
  console.log(req.files);
});

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

