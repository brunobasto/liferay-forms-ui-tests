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
	}

	if (type === 'inputfield') {
		browser.getValue(element)
			.then(assertText)
			.call(done)
	}
	else {
		isIE(browser)
			.then(function(ie) {
				var textAttribute = ie ? 'innerText' : 'textContent';

				browser.getAttribute(element, textAttribute)
					.then(assertText)
					.call(done)
			})
	}
};