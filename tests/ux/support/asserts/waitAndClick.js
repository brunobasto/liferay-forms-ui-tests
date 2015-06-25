var waitFor = require('./waitFor');

module.exports = function(action, type, element, done) {
	var instance = this;

	var executeAction = function() {
		var method = action === 'click' ? 'click' : 'doubleClick';

		instance.browser[method](element).call(done);
	};

	instance.browser.elements(element, function (err, elements) {
		if (err || elements.value.length === 0) {
			waitFor.call(instance, element, null, 'exist', executeAction);
		}
		else {
			executeAction();
		}
	});
};