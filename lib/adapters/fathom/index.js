var async = require('async'),
	fs = require('fs'),
	path = require('path');

var load = function(callback) {
	var adapter = {
		name: 'fathom',
		boilerplate: {},
		markup: {}
	};

	var loadFile = function(filename) {
		return function(asyncCallback) {
			fs.readFile(path.join(__dirname, filename), 'utf8', asyncCallback);
		};
	};

	async.parallel({
		head: loadFile('markup/head.html'),
		foot: loadFile('markup/foot.html'),
		beforeSlides: loadFile('markup/beforeSlides.html'),
		afterSlides: loadFile('markup/afterSlides.html'),
		html: loadFile('boilerplate/slides.html'),
		css: loadFile('boilerplate/slides.css')
	}, function(err, results) {
		adapter.markup.head = results.head;
		adapter.markup.foot = results.foot;
		adapter.markup.beforeSlides = results.beforeSlides;
		adapter.markup.afterSlides = results.afterSlides;

		adapter.boilerplate.html = results.html;
		adapter.boilerplate.css = results.css;

		callback(null, adapter);
	});
}

exports.load = load;