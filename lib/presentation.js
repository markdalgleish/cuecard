var _ = require('underscore');

var Presentation = function(config) {
	var defaults = {
		adapter: 'fathom',
		remoteUrl: false,
		port: 3000
	};

	_.extend(this, defaults, config);

	if (this.remoteUrl === true) {
		this.remoteUrl = '/remote';
	}
};

exports.Presentation = Presentation;