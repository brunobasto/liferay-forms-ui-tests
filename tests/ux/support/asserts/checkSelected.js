module.exports = function (element, falseCase, done) {
	this.browser.isSelected(element, function(err,isSelected) {
		should.not.exist(err);

		if (falseCase) {
			isSelected.should.not.equal(true, element + ' should not be selected');
		}
		else {
			isSelected.should.equal(true, element + ' should be selected');
		}
	}).call(done);
};