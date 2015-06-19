/**
 * check content for specific element or input field
 */

module.exports =  function(type, element, falseCase, origText, done) {
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
		this.browser.getValue(element, assertText).call(done);
	}
	else {
		this.browser.getAttribute(element, 'innerText', assertText).call(done);
	}
};
