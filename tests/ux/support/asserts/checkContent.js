/**
 * check content for specific element or input field
 */

var isIE = require('../utils/isIE');

module.exports =  function(type, element, falseCase, origText, done) {
	var browser = this.browser;

	var assertText = function(err, text) {
		should.not.exist(err);

		if (falseCase) {
			origText.should.not.equal(text);
		}
		else {
			origText.should.equal(text);
		}
	}

	if (type === 'inputfield') {
		browser.getValue(element, assertText).call(done);
	}
	else {
		isIE(browser, function(err, ie) {
			var textAttribute = ie ? 'innerText' : 'textContent';

			browser.getAttribute(element, textAttribute, assertText).call(done);
		});
	}
};
