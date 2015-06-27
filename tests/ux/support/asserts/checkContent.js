var isIE = require('../utils/isIE');

module.exports =  function(type, element, falseCase, origText, done) {
	var browser = this.browser;

	var assertText = function(text) {
		if (falseCase) {
			origText.should.not.equal(text);
		}
		else {
			origText.should.equal(text);
		}
	};

	if (type === 'inputfield') {
		browser.getValue(element)
			.then(assertText)
			.catch(function(err) {
				should.not.exist(err);
			})
			.call(done)
	}
	else {
		browser.getText(element)
			.then(assertText)
			.catch(function(err) {
				should.not.exist(err);
			})
			.call(done)
	}
};