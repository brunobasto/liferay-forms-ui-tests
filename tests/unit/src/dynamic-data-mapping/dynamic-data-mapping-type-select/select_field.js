'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Field Select', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-field-select',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should render the select with the selected option according to the unlocalized value attribute', function(done) {
		var selectField = new Liferay.DDM.Field.Select({
			localizable: false,
			options: [
				{
					label: {
						en_US: 'Bruno'
					},
					value: 'bruno'
				},
				{
					label: {
						en_US: 'Marcellus'
					},
					value: 'marcellus'
				}
			],
			value: ['marcellus']
		});

		assert.equal(selectField.getInputNode().val(), 'marcellus');

		done();
	});

	it('should have the value attribute always as an Array', function(done) {
		var selectField = new Liferay.DDM.Field.Select({
			localizable: false,
			options: [
				{
					label: {
						en_US: 'Bruno'
					},
					value: 'bruno'
				},
				{
					label: {
						en_US: 'Marcellus'
					},
					value: 'marcellus'
				}
			],
			value: undefined
		});

		assert.isArray(selectField.get('value'));
		assert.lengthOf(selectField.get('value'), 0);

		selectField.set('value', '');

		assert.isArray(selectField.get('value'));
		assert.lengthOf(selectField.get('value'), 0);

		done();
	});

	it('should render the select with the selected option according to the localized value attribute', function(done) {
		var selectField = new Liferay.DDM.Field.Select({
			localizable: true,
			locale: 'en_US',
			options: [
				{
					label: {
						en_US: 'Bruno'
					},
					value: 'bruno'
				},
				{
					label: {
						en_US: 'Marcellus'
					},
					value: 'marcellus'
				}
			],
			value: {
				en_US: ['marcellus']
			}
		});

		assert.equal(selectField.getInputNode().val(), 'marcellus');

		done();
	});

	it('should render all the options values according to the attribute "options"', function(done) {
		var selectField = new Liferay.DDM.Field.Select({
			localizable: false,
			options: [
				{
					label: {
						en_US: 'Bruno'
					},
					value: 'bruno'
				},
				{
					label: {
						en_US: 'Marcellus'
					},
					value: 'marcellus'
				}
			]
		});

		var options = selectField.get('options');

		selectField.getInputNode().all('option').each(function(optionNode, index) {
			assert.equal(options[index].value, optionNode.attr('value'), 'option valuein DOM should match');

			assert.equal(
				options[index].label[selectField.get('locale')],
				optionNode.text(),
				'Displayed label should be the one corresponding to the current locale'
			);
		});

		done();
	});

	it('should serialize the value according the the selected option', function(done) {
		var selectField = new Liferay.DDM.Field.Select({
			localizable: false,
			options: [
				{
					label: {
						en_US: 'Bruno'
					},
					value: 'bruno'
				},
				{
					label: {
						en_US: 'Marcellus'
					},
					value: 'marcellus'
				}
			]
		});

		selectField.getInputNode().val('marcellus');

		var json = selectField.toJSON();

		assert.property(json, 'value');
		assert.equal(json.value, 'marcellus');

		done();
	});

	it('should not have any options selected when there\'s no value for the desired language', function(done) {
		var selectField = new Liferay.DDM.Field.Select({
			localizable: true,
			locale: 'pt_BR',
			options: [
				{
					label: {
						en_US: 'Bruno'
					},
					value: 'bruno'
				},
				{
					label: {
						en_US: 'Marcellus'
					},
					value: 'marcellus'
				}
			]
		});

		var selectedOptions = selectField.getInputNode().all('option[selected]');

		assert.isTrue(selectedOptions.size() === 0);

		done();
	});
});