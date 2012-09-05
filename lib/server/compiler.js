var fs = require('fs');

var watch = function(config) {
	compileSlides(config.slides, config.onSlideChange);
	compileStyles(config.styles, config.onStyleChange);

	fs.watch(config.slides, function() {
		compileSlides(config.slides, config.onSlideChange);
	});

	fs.watch(config.styles, function() {
		compileStyles(config.styles, config.onStyleChange);
	});
};

var compileSlides = function(slides, callback) {
	fs.readFile(slides, 'utf8', function (err, data) {
		callback(err, !err && slides.indexOf('.jade') > 0 ? jade.compile(data)() : data);
	});
};

var compileStyles = function(styles, callback) {
	fs.readFile(styles, 'utf8', function (err, data) {
		if (styles.indexOf('.styl') > 0) {
			stylus.render(data, {}, function(err, css) {
				callback(err, !err && css);
			});
		} else {
			callback(err, !err && data);
		}
	});
};

exports.watch = watch;