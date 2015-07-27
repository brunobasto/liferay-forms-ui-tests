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
			validationMessages: [
				'This field is required',
				'This field value is not correct'
			],
			type: 'text'
		});

		var validationMessages = field.get('validationMessages');

		var nodes = field.get('container').all('.validation-message');

		assert.equal(nodes.size(), validationMessages.length);

		nodes.each(function(node) {
			assert.equal(node.text(), validationMessages.pop());
		});

		field.destroy();

		done();
	});

	it('should add one error message at the top after calling .addValidationMessage()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			validationMessages: [
				'This field is required',
				'This field value is not correct'
			],
			type: 'text'
		});

		var validationMessages = field.get('validationMessages');

		field.addValidationMessage('New error message');

		assert.equal(3, validationMessages.length);

		var nodes = field.get('container').all('.validation-message');

		assert.equal(nodes.item(0).text(), 'New error message');

		field.destroy();

		done();
	});

	it('should clear the error messages after calling .clearValidationMessages()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			validationMessages: [
				'This field is required',
				'This field value is not correct'
			],
			type: 'text'
		});

		field.clearValidationMessages();

		var validationMessages = field.get('validationMessages');
		var nodes = field.get('container').all('.validation-message');

		assert.equal(nodes.size(), 0);
		assert.equal(validationMessages.length, 0);

		field.destroy();

		done();
	});

	it('should clear validation status after calling .clearValidationStatus()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			validationExpression: 'false',
			validationMessages: [
				'This field is required',
				'This field value is not correct'
			],
			type: 'text'
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
			validationExpression: 'false',
			validationMessages: [
				'This field is required',
				'This field value is not correct'
			],
			type: 'text'
		});

		field.showValidationStatus();

		var container = field.get('container');

		assert.isTrue(container.hasClass('has-error'));
		assert.isFalse(container.hasClass('has-success'));

		field.set('validationMessages', []);

		field.showValidationStatus();

		assert.isFalse(container.hasClass('has-error'));
		assert.isTrue(container.hasClass('has-success'));

		field.destroy();

		done();
	});
});