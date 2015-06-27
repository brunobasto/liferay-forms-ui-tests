var waitFor = require('./waitFor');

module.exports = function(action, element, done) {
	var instance = this;

	var executeAction = function() {
		var method = action === 'click' ? 'click' : 'doubleClick';

		instance.browser[method](element).call(done);
	};

	instance.browser.elements(element)
		.then(function (elements) {
			if (elements.value.length === 0) {
				waitFor.call(instance, element, null, 'exist', executeAction);
			}
			else {
				executeAction();
			}
		})
		.catch(function(err) {
			should.not.exist(err);
		});
};