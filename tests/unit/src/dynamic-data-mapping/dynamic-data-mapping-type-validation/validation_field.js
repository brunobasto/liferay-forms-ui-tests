'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Field Validation', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-field-validation',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should create the expression acording to the form state', function(done) {
		var nameField = new Liferay.DDM.Field.Text({
			name: 'name',
			value: 'myField'
		}).render(document.body);

		var validationField = new Liferay.DDM.Field.Validation({
			name: 'validationField'
		}).render(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			fields: [nameField, validationField]
		}).render();

		var container = validationField.get('container');

		container.one('.enable-validation').attr('checked', true);
		container.one('.enable-validation').simulate('change');

		container.one('.types-select').val('number');
		container.one('.types-select').simulate('change');

		container.one('.validations-select').val('eq');
		container.one('.validations-select').simulate('change');

		container.one('.parameter-input').val('5');

		var validation = validationField.getValue();

		assert.equal('myField==5', validation.expression);

		validationField.destroy();

		done();
	});

	it('should set the parameters acording to the validation object', function(done) {
		var validationField = new Liferay.DDM.Field.Validation({
			name: 'validationField'
		}).render(document.body);

		validationField.set('value', {
			errorMessage: 'Sorry, it failed.',
			expression: 'myField==6'
		});

		assert.equal(validationField.get('errorMessageValue'), 'Sorry, it failed.');
		assert.equal(validationField.get('selectedType'), 'number');
		assert.equal(validationField.get('selectedValidation').name, 'eq');
		assert.equal(validationField.get('parameterValue'), '6');

		validationField.destroy();

		done();
	});
});