var express = require('express'),
	http = require('http');

var app = express();
var server = http.createServer(app);

app.configure(function(){
	app.use(express.static(__dirname + '/public'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

	socket.on('activateslide', function(data) {
		socket.broadcast.emit('activateslide', {
			index: typeof data.index === 'number' ? data.index : undefined
		});
	});

});

exports.server = server;