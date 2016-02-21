'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Field Feedback Support', function() {
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
			errorMessage: 'This field is required',
			type: 'text'
		}).render();

		var errorMessage = field.get('errorMessage');

		var node = field.get('container').one('.help-block');

		assert.ok(node);
		assert.equal(node.text(), errorMessage);

		field.destroy();

		done();
	});

	it('should show one error message at the top after calling .showErrorMessage()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			errorMessage: 'This field is required',
			type: 'text'
		}).render();

		var errorMessage = field.get('errorMessage');

		field.showErrorMessage('New error message');

		var node = field.get('container').one('.help-block');

		assert.ok(node);
		assert.equal(node.text(), 'New error message');

		field.destroy();

		done();
	});

	it('should clear the error messages after calling .hideErrorMessage()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			errorMessage: 'This field is required',
			type: 'text'
		});

		field.hideErrorMessage();

		var errorMessage = field.get('errorMessage');
		var nodes = field.get('container').all('.validation-message');

		assert.equal(nodes.size(), 0);
		assert.equal(errorMessage.length, 0);

		field.destroy();

		done();
	});

	it('should clear validation status after calling .clearValidationStatus()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			errorMessage: 'This field is required',
			type: 'text',
			validation: {
				expression: 'false'
			}
		});

		field.showValidationStatus();

		var container = field.get('container');

		assert.isTrue(container.hasClass('has-error'));

		field.clearValidationStatus();

		assert.isFalse(container.hasClass('has-error'));
		assert.isFalse(container.hasClass('has-success'));

		field.destroy();

		done();
	});

	it('should show validation status after calling .showValidationStatus()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			errorMessage: 'This field is required',
			type: 'text',
			validation: {
				expression: 'false'
			}
		});

		field.showValidationStatus();

		var container = field.get('container');

		assert.isTrue(container.hasClass('has-error'));

		field.set('errorMessage', '');

		field.showValidationStatus();

		assert.isFalse(container.hasClass('has-error'));

		field.destroy();

		done();
	});
});