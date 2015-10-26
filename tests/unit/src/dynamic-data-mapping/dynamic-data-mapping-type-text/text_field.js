'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Field Text', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-field-text',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should show the loading feedback inside the container', function(done) {
		var textField = new Liferay.DDM.Field.Text({
			name: 'textField',
			value: 'marcellus'
		}).render(document.body);

		textField.showLoadingFeedback();

		var container = textField.get('container');

		var spinner = container.one('.icon-spinner');

		assert.isTrue(spinner.inDoc());
		assert.isTrue(spinner.previous() !== textField.getInputNode());

		textField.destroy();

		done();
	});

	it('should show a tooltip when tip is not null', function(done) {
		var textField = new Liferay.DDM.Field.Text({
			name: 'textField',
			tip: 'this is some tip',
			value: 'marcellus'
		}).render(document.body);

		textField.showLoadingFeedback();

		var container = textField.get('container');

		assert.isTrue(container.one('.help-icon').inDoc());

		textField.destroy();

		done();
	});

	it('should show a tooltip when tip a localized value', function(done) {
		var textField = new Liferay.DDM.Field.Text({
			name: 'textField',
			tip: {
				en_US: 'this is some tip'
			},
			value: 'marcellus'
		}).render(document.body);

		textField.showLoadingFeedback();

		var container = textField.get('container');

		assert.isTrue(container.one('.help-icon').inDoc());

		textField.destroy();

		done();
	});
});