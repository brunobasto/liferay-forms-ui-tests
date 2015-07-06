'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Field Radio', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-field-radio',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should render the selected radio according to the unlocalized value attribute', function(done) {
		var radioField = new Liferay.DDM.Field.Radio({
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
			value: 'marcellus'
		});

		var radios = radioField.get('container').all('input[type="radio"]');

		radios.each(function(radio) {
			if (radio.val() === radioField.get('value')) {
				assert.isTrue(radio.get('checked'));
			}
		});

		done();
	});

	it('should render the selected radio according to the localized value attribute', function(done) {
		var radioField = new Liferay.DDM.Field.Radio({
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
				en_US: 'marcellus'
			}
		});

		var radios = radioField.get('container').all('input[type="radio"]');

		radios.each(function(radio) {
			if (radio.val() === radioField.get('value')) {
				assert.isTrue(radio.get('checked'));
			}
		});

		done();
	});

	it('should serialize the unlocalizable value according the selected radio', function(done) {
		var radioField = new Liferay.DDM.Field.Radio({
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
			value: 'marcellus'
		});

		radioField.get('container').appendTo(document.body);

		radioField.get('container').one('[value="bruno"]').simulate('click');

		var json = radioField.toJSON();

		assert.equal(json.value, 'bruno');

		done();
	});
});