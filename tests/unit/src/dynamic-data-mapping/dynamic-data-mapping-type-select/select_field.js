'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

var createField = function(formBuilder, type, name) {
	var fieldType = Liferay.DDM.Renderer.FieldTypes.get(type),
		field = formBuilder.createField(fieldType);

	field.set('name', name);

	return field;
};

var setFieldSetting = function(field, setting, value) {
	var nameSettingsField = _.filter(
		field.get('settingsForm').get('fields'),
		function(settingsField) {
			return settingsField.get('name') === setting;
		}
	)[0].setValue(value);
};

describe('DDM Field Select', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-field-select',
			'liferay-ddl-form-builder',
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
			readOnly: true,
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
		}).render();

		assert.equal(selectField.getInputNode().val(), 'marcellus');

		selectField.destroy();

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
		}).render();

		assert.isArray(selectField.get('value'));
		assert.lengthOf(selectField.get('value'), 0);

		selectField.set('value', '');

		assert.isArray(selectField.get('value'));
		assert.lengthOf(selectField.get('value'), 0);

		selectField.destroy();

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
		}).render();

		assert.equal(selectField.getInputNode().val(), 'marcellus');

		selectField.destroy();

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
		}).render();

		var options = selectField.get('options');

		selectField.getInputNode().all('option').each(function(optionNode, index) {
			if (index === 0) {
				return; // first option is 'Select an option'
			}

			assert.equal(options[index-1].value, optionNode.attr('value'), 'option valuein DOM should match');

			assert.equal(
				options[index-1].label[selectField.get('locale')],
				optionNode.text(),
				'Displayed label should be the one corresponding to the current locale'
			);
		});

		selectField.destroy();

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
		}).render();

		selectField.getInputNode().val('marcellus');

		var json = selectField.toJSON();

		assert.property(json, 'value');
		assert.equal(json.value, 'marcellus');

		selectField.destroy();

		done();
	});

	it('should default option selected when there\'s no value for the desired language', function(done) {
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
		}).render();

		var selectedOptions = selectField.getInputNode().all('option[selected]');

		assert.isTrue(selectedOptions.size() === 1);
		assert.equal(selectedOptions.item(0).attr('disabled'), true);

		selectField.destroy();

		done();
	});

	it('should allow the user to add and remove options on the configuration form', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder().render(document.body);

		var newSelectField = createField(formBuilder, 'select', 'select');

		formBuilder.showFieldSettingsPanel(newSelectField, newSelectField.get('name'));

		setFieldSetting(newSelectField, 'name', 'select');

		var settingsForm = newSelectField.get('settingsForm');

		var optionsField = settingsForm.getField('options');

		var sizeBefore = optionsField.getLastField().get('repetitions').length;

		optionsField.addField();

		var sizeAfter = optionsField.getLastField().get('repetitions').length;

		assert.isFalse(sizeAfter === sizeBefore);

		formBuilder.destroy();

		done();
	});
});