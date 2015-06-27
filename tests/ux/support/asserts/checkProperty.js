module.exports = function(isCSS, attrName, elem, falseCase, value, done) {
	var command = isCSS ? 'getCssProperty' : 'getAttribute';

	this.browser[command](elem, attrName, function(err,res) {
		should.not.exist(err);

		/**
		 * when getting something with a color WebdriverIO returns a color
		 * object but we want to assert against a string
		 */
		if (attrName.indexOf('color') > -1) {
			res = res.value;
		}

		if (falseCase) {
			res.should.not.equal(value, (isCSS ? 'CSS ' : '') + 'Attribut des Elementes ' + elem + ' sollte nicht den Wert ' + res + ' besitzen');
		}
		else {
			res.should.equal(value, (isCSS ? 'CSS ' : '') + 'Attribut des Elementes ' + elem + ' sollte nicht den Wert ' + res + ' besitzen, sondern ' + value);
		}
	}).call(done);
};