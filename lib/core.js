var express = require('express'),
	http = require('http'),
	_ = require('underscore'),
	compiler = require('./compiler.js'),
	remote = require('./remote.js');

var app = express(),
	server = http.createServer(app);

var createPresentation = function(config) {
	var defaults = {
		adapter: 'fathom',
		remoteUrl: false,
		port: 3000
	};

	var presentation = _.extend({}, defaults, config);

	if (presentation.remoteUrl === true) {
		presentation.remoteUrl = '/remote';
	}

	return presentation;
};

var configureApp = function(app, presentation) {
	app.configure(function(){
		app.use(express.static(__dirname + '/adapters/' + presentation.adapter + '/static'));
		app.use(express.static(__dirname + '/static'));

		presentation.static && app.use(express.static(presentation.static));

		app.use(express.bodyParser());
		app.use(app.router);

		app.set('view engine', 'jade');
	});
};

var renderPresentation = function(res, presentation) {
	res.render(__dirname + '/views/presentation.jade', presentation);
};

var setupDefaultRoute = function(app, presentation) {
	app.get('/', function(req, res) {
		presentation.isRemote = false;
		renderPresentation(res, presentation);
	});
};

var setupCompiler = function(config, presentation) {
	compiler.watch({
		slides: config.slides,
		styles: config.styles,
		onSlideChange: function(err, data) {
			presentation.slides = data;
		},
		onStyleChange: function(err, data) {
			presentation.styles = data;
		}
	});
};

var setupRemote = function(app, presentation) {
	if (presentation.remoteUrl) {
		remote.listen(server);

		app.get(presentation.remoteUrl, function(req, res) {
			presentation.isRemote = true;
			renderPresentation(res, presentation);
		});
	}
};

var createServer = function(config) {
	var presentation = createPresentation(config);

	require('./adapters/' + presentation.adapter + '/index.js').load(function(err, adapter) {
		presentation.markup = adapter.markup;

		configureApp(app, presentation);

		setupDefaultRoute(app, presentation);
		setupCompiler(config, presentation);
		setupRemote(app, presentation);

		server.listen(presentation.port);
		console.log('Cuecard running on port ' + presentation.port);
	});
};

exports.create = createServer;