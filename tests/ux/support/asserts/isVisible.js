module.exports = function (element, falseCase, done) {
	var exists = false;

	this.browser.elements(element)
		.then(function (elements) {
	        exists = elements.value.length > 0;

	        exists.should.equal(true, 'expected element "' + element + '" to exist');
	    })
	    .catch(function(err) {
	    	should.not.exist(err);
	    })

	if (exists) {
		this.browser.isVisible(element)
			.then(function (visible) {
				if (falseCase) {
					visible.should.not.equal(true, 'expected element "' + element + '" not to be visible');
				}
				else {
					visible.should.equal(true, 'expected element "' + element + '" to be visible');
				}
			})
			.catch(function(err) {
				should.not.exist(err);
			})
	}

	this.browser.call(done);
};