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
		});

		assert.isFalse(checkboxField.getValue());

		done();
	});

	it('should render the checkbox checked or unchecked depending on the value', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			localizable: false,
			value: false
		});

		assert.isFalse(checkboxField.getValue());

		checkboxField.set('value', true);

		assert.isTrue(checkboxField.getValue());

		done();
	});

	it('should set the value always as a boolean', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			localizable: true,
			value: {
				en_US: 'false',
				pt_BR: 'true'
			}
		});

		var value = checkboxField.get('value');

		for (var locale in value) {
			assert.isBoolean(value[locale]);
		}

		done();
	});

	it('should serialize the value attribute according to the checkbox input status', function(done) {
		var checkboxField = new Liferay.DDM.Field.Checkbox({
			localizable: false,
			value: true
		});

		checkboxField.set('value', false);

		var json = checkboxField.toJSON();

		assert.isFalse(json.value);

		done();
	});
});