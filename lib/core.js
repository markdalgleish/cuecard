var express = require('express'),
	http = require('http'),
	fs = require('fs');

var app = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

	socket.on('activateslide', function(data) {
		socket.broadcast.emit('activateslide', {
			index: typeof data.index === 'number' ? data.index : undefined
		});
	});

});

var presentation = {
	remoteUrl: '/remote'
};
var configure = function(config) {
	if (config.remoteUrl !== undefined) {
		presentation.remoteUrl = config.remoteUrl;
	}

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

var create = function(config) {
	configure(config);

	app.configure(function(){
		app.use(express.static(__dirname + '/public'));
		app.use(express.bodyParser());
		app.use(app.router);
		app.set('view engine', 'jade');
	});

	app.get('/', function(req, res) {
		presentation.isRemote = false;
		res.render(__dirname + '/views/presentation.jade', presentation);
	});

	if (presentation.remoteUrl) {
		app.get(presentation.remoteUrl, function(req, res) {
			presentation.isRemote = true;
			res.render(__dirname + '/views/presentation.jade', presentation);
		});
	}

	var port = config.port || 3000;
	server.listen(port);
	console.log('Cuecard running on port ' + port);
};

exports.create = create;