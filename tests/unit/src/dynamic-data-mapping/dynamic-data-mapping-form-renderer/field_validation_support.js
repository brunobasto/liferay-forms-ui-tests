'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Field Validation Support', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-renderer-field',
			'liferay-ddm-form-renderer-field-validation',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should render the error messages uppon initialization', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			errorMessages: [
				'This field is required',
				'This field value is not correct'
			],
			type: 'text'
		});

		var errorMessages = field.get('errorMessages');

		var nodes = field.get('container').all('.validation-message');

		assert.equal(nodes.size(), errorMessages.length);

		nodes.each(function(node) {
			assert.equal(node.text(), errorMessages.pop());
		});

		field.destroy();

		done();
	});

	it('should add one error message at the top after calling .addErrorMessage()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			errorMessages: [
				'This field is required',
				'This field value is not correct'
			],
			type: 'text'
		});

		var errorMessages = field.get('errorMessages');

		field.addErrorMessage('New error message');

		assert.equal(3, errorMessages.length);

		var nodes = field.get('container').all('.validation-message');

		assert.equal(nodes.item(0).text(), 'New error message');

		field.destroy();

		done();
	});

	it('should clear the error messages after calling .clearErrorMessages()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			errorMessages: [
				'This field is required',
				'This field value is not correct'
			],
			type: 'text'
		});

		field.clearErrorMessages();

		var errorMessages = field.get('errorMessages');
		var nodes = field.get('container').all('.validation-message');

		assert.equal(nodes.size(), 0);
		assert.equal(errorMessages.length, 0);

		field.destroy();

		done();
	});
});