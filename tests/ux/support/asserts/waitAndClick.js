var waitFor = require('./waitFor');

module.exports = function(action, type, element, done) {
	var instance = this;

	waitFor.call(instance, element, null, 'visible', function(err, res) {
		should.not.exist(err);

		var elem = type === 'link' ? '=' + element : element,
			method = action === 'click' ? 'click' : 'doubleClick';

		instance.browser[method](elem).call(done);
	});
};