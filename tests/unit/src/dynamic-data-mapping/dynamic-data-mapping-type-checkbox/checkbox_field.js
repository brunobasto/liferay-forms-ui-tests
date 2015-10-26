'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Field Checkbox', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-field-checkbox',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should render the checkbox checked or unchecked depending on the value when value is empty', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			locale: 'en_US',
			value: {
				en_US: ''
			}
		}).render(document.body);

		assert.isFalse(checkboxField.getValue());

		checkboxField.destroy();

		done();
	});

	it('should render the checkbox checked or unchecked depending on the value', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			localizable: false,
			value: false
		}).render(document.body);

		assert.isFalse(checkboxField.getValue());

		checkboxField.set('value', true);

		assert.isTrue(checkboxField.getValue());

		checkboxField.destroy();

		done();
	});

	it('should set the value always as a boolean', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			localizable: true,
			value: {
				en_US: 'false',
				pt_BR: 'true'
			}
		}).render();

		var value = checkboxField.get('value');

		for (var locale in value) {
			assert.isBoolean(value[locale]);
		}

		checkboxField.destroy();

		done();
	});

	it('should update the checkbox state correctly after calling .setValue', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			localizable: true,
			value: {
				en_US: 'false',
				pt_BR: 'true'
			}
		}).render();

		var inputNode = checkboxField.getInputNode();

		assert.isFalse(inputNode.attr('checked'));

		checkboxField.setValue(true);

		assert.isTrue(inputNode.attr('checked'));

		checkboxField.destroy();

		done();
	});

	it('should show the loading feedback inside the container', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			localizable: true,
			value: {
				en_US: 'false',
				pt_BR: 'true'
			}
		}).render(document.body);

		checkboxField.showLoadingFeedback();

		var container = checkboxField.get('container');

		var spinner = container.one('.icon-spinner');

		assert.isTrue(spinner.inDoc());
		assert.isTrue(spinner.previous() !== checkboxField.getInputNode());

		checkboxField.destroy();

		done();
	});

	it('should serialize the value attribute according to the checkbox input status', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			localizable: false,
			value: true
		}).render();

		checkboxField.set('value', false);

		var json = checkboxField.toJSON();

		assert.isFalse(json.value);

		checkboxField.destroy();

		done();
	});
});