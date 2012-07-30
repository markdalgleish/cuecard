var cuecard = require('../lib/cuecard.js');

exports['api'] = {
	'has "create"': function(test) {
		test.expect(1);
		test.equal(typeof cuecard.create, 'function');
		test.done();
	}
};