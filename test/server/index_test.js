var server = require('../../lib/server');

exports['api'] = {
	'has "create"': function(test) {
		test.expect(1);
		test.equal(typeof server.create, 'function');
		test.done();
	}
};