var express = require('express'),
	http = require('http'),
	fs = require('fs');

var presentation = {};
var configure = function(config) {
	if (config.title) {
		presentation.title = config.title;
	}

	if (config.html) {
		fs.readFile(config.html, 'utf8', function (err, data) {
		  if (err) throw err;
		  presentation.html = data;
		});
	}

	if (config.css) {
		fs.readFile(config.css, 'utf8', function (err, data) {
		  if (err) throw err;
		  presentation.css = data;
		});
	}
};

var app = express();
var server = http.createServer(app);

app.configure(function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
});

app.get('/', function(req, res){
	res.render(__dirname + '/views/presentation.jade', presentation);
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

	socket.on('activateslide', function(data) {
		socket.broadcast.emit('activateslide', {
			index: typeof data.index === 'number' ? data.index : undefined
		});
	});

});

exports.configure = configure;
exports.server = server;