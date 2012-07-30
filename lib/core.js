var express = require('express'),
	http = require('http'),
	fs = require('fs');

// Pre-processors
var jade = require('jade'),
	stylus = require('stylus');

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
	adapter: 'fathom',
	remoteUrl: '/remote'
};
var configure = function(config) {
	if (config.remoteUrl !== undefined) {
		presentation.remoteUrl = config.remoteUrl;
	}

	if (config.title) {
		presentation.title = config.title;
	}

	if (config.adapter) {
		presentation.adapter = config.adapter;
	}

	if (config.slides) {
		fs.readFile(config.slides, 'utf8', function (err, data) {
		  if (err) throw err;

		  presentation.slides = data;

		  if (config.slides.indexOf('.jade') > 0) {
		  	presentation.slides = jade.compile(presentation.slides)();
		  }
		});
	}

	if (config.styles) {
		fs.readFile(config.styles, 'utf8', function (err, data) {
		  if (err) throw err;

		  presentation.styles = data;

		  if (config.styles.indexOf('.styl') > 0) {
		  	stylus.render(presentation.styles, {}, function(err, css) {
		  		presentation.styles = css;
		  	});
		  }
		});
	}
};

var create = function(config) {
	configure(config);

	presentation.files = require('./adapters/' + presentation.adapter + '/files.js');

	app.configure(function(){
		app.use(express.static(__dirname + '/adapters/' + presentation.adapter + '/static'));
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