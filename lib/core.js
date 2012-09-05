var express = require('express'),
	http = require('http'),
	compiler = require('./compiler.js'),
	remote = require('./remote.js'),
	Presentation = require('./presentation').Presentation;

var app = express(),
	server = http.createServer(app);

var configureApp = function(app, pres) {
	app.configure(function(){
		app.use(express.static(__dirname + '/adapters/' + pres.adapter + '/static'));
		app.use(express.static(__dirname + '/static'));

		pres.static && app.use(express.static(pres.static));

		app.use(express.bodyParser());
		app.use(app.router);

		app.set('view engine', 'jade');
	});
};

var renderPresentation = function(res, pres, isRemote) {
	pres.isRemote = isRemote === true;
	res.render(__dirname + '/views/presentation.jade', pres);
};

var setupDefaultRoute = function(app, pres) {
	app.get('/', function(req, res) {
		renderPresentation(res, pres);
	});
};

var setupCompiler = function(config, pres) {
	compiler.watch({
		slides: config.slides,
		styles: config.styles,
		onSlideChange: function(err, data) {
			pres.slides = data;
		},
		onStyleChange: function(err, data) {
			pres.styles = data;
		}
	});
};

var setupRemote = function(app, pres) {
	if (pres.remoteUrl) {
		remote.listen(server);

		app.get(pres.remoteUrl, function(req, res) {
			renderPresentation(res, pres, true);
		});
	}
};

var createServer = function(config) {
	var pres = new Presentation(config);

	require('./adapters/' + pres.adapter + '/index.js').load(function(err, adapter) {
		pres.markup = adapter.markup;

		configureApp(app, pres);

		setupDefaultRoute(app, pres);
		setupCompiler(config, pres);
		setupRemote(app, pres);

		server.listen(pres.port);
		console.log('Cuecard running on port ' + pres.port);
	});
};

exports.create = createServer;