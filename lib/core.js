var express = require('express'),
	http = require('http'),
	fs = require('fs'),
	path = require('path');

// Pre-processors
var jade = require('jade'),
	stylus = require('stylus');

var app = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

	socket.on('activateslide', function(data) {
		socket.broadcast.emit('activateslide', {
			indexh: typeof data.indexh === 'number' ? data.indexh : undefined,
			indexv: typeof data.indexv === 'number' ? data.indexv : undefined
		});
	});

});

var presentation = {
	adapter: 'fathom',
	remoteUrl: false
};
var configure = function(config) {
	if (config.remoteUrl !== undefined) {
		presentation.remoteUrl = config.remoteUrl;

		if (presentation.remoteUrl === true) {
			presentation.remoteUrl = '/remote';
		}
	}

	if (config.title) {
		presentation.title = config.title;
	}

	if (config.adapter) {
		presentation.adapter = config.adapter;
	}

	compile(config);
};

var compile = function(config) {
	compileSlides(config.slides);
	compileStyles(config.styles);

	fs.watch(config.slides, function() {
		compileSlides(config.slides);
	});

	fs.watch(config.styles, function() {
		compileStyles(config.styles);
	});
};

var compileSlides = function(slides) {
	if (slides) {
		fs.readFile(slides, 'utf8', function (err, data) {
		  if (err) throw err;

		  presentation.slides = data;

		  if (slides.indexOf('.jade') > 0) {
		  	presentation.slides = jade.compile(presentation.slides)();
		  }
		});
	}
};

var compileStyles = function(styles) {
	if (styles) {
		fs.readFile(styles, 'utf8', function (err, data) {
		  if (err) throw err;

		  presentation.styles = data;

		  if (styles.indexOf('.styl') > 0) {
		  	stylus.render(presentation.styles, {}, function(err, css) {
		  		presentation.styles = css;
		  	});
		  }
		});
	}
};

var create = function(config) {
	configure(config);

	require('./adapters/' + presentation.adapter + '/index.js').load(function(err, adapter) {
		presentation.markup = adapter.markup;

		app.configure(function(){
			app.use(express.static(__dirname + '/adapters/' + presentation.adapter + '/static'));
			app.use(express.static(__dirname + '/static'));

			if (config.static) {
				app.use(express.static(config.static));
			}

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
	});
};

exports.create = create;