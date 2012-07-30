var cuecard = require('../lib/cuecard.js');

exports['api'] = {
	'has server': function(test) {
		test.expect(1);
		test.equal(typeof cuecard.server, 'object');
		test.done();
	}
};