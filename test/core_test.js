var core = require('../lib/core.js');

exports['api'] = {
	'has server': function(test) {
		test.expect(1);
		test.equal(typeof core.server, 'object');
		test.done();
	}
};