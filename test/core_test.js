var core = require('../lib/core.js');

exports['api'] = {
	'has "create"': function(test) {
		test.expect(1);
		test.equal(typeof core.create, 'function');
		test.done();
	}
};