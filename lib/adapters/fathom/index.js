var async = require('async'),
	fs = require('fs'),
	path = require('path');

var load = function(callback) {
	var adapter = {
		markup: {}
	};

	async.parallel({
		head: function(asyncCallback) {
			fs.readFile(path.join(__dirname, 'markup/head.html'), 'utf8', asyncCallback);
		},
		foot: function(asyncCallback) {
			fs.readFile(path.join(__dirname, 'markup/foot.html'), 'utf8', asyncCallback);
		},
		beforeSlides: function(asyncCallback) {
			fs.readFile(path.join(__dirname, 'markup/beforeSlides.html'), 'utf8', asyncCallback);
		},
		afterSlides: function(asyncCallback) {
			fs.readFile(path.join(__dirname, 'markup/afterSlides.html'), 'utf8', asyncCallback);
		},
	}, function(err, results) {
		adapter.markup = results;

		callback(null, adapter);
	});
}

exports.load = load;