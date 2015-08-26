'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/wizard.html')
	).done(callback);
};

describe('DDM Renderer Util', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		AUI().use(
			'liferay-ddm-form-renderer-wizard',
			function(A) {
				getTestData(function(wizardMarkup) {
					test.wizardMarkup = wizardMarkup;

					done();
				});
			}
		);
	});

	beforeEach(function(done) {
		var test = this,
			A = AUI();

		test.boundingBox = A.Node.create(test.wizardMarkup);

		test.boundingBox.appendTo(document.body);

		done();
	});

	afterEach(function(done) {
		var test = this;

		test.boundingBox.remove();

		done();
	});

	it('should create items attribute from nodes in markup', function(done) {
		var test = this,
			boundingBox = test.boundingBox;

		var wizard = new Liferay.DDM.Renderer.Wizard({
			boundingBox: boundingBox,
			srcNode: boundingBox.one('ul')
		}).render();

		assert.lengthOf(wizard.get('items'), 5);

		done();
	});
});