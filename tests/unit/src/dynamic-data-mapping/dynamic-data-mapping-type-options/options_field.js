'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Field Options', function() {
	this.timeout(120000);

	before(function(done) {
		Liferay.Language.get = sinon.stub().returnsArg(0);

		AUI().use(
			'liferay-ddm-form-field-options',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should render as many input rows as defined in the value attribute', function(done) {
		var optionsField = new Liferay.DDM.Field.Options({
			value: [
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
				},
				{
					label: {
						en_US: 'Jadson'
					},
					value: 'jadson'
				}
			]
		}).render();

		var value = optionsField.get('value');

		var repetitions = optionsField.getLastField().get('repetitions');

		repetitions.forEach(function(repetition, index) {
			var optionValue = value[index];

			if (optionValue) {
				assert.equal(optionValue.label[optionsField.get('locale')], repetition.getValue());
				assert.equal(optionValue.value, repetition.get('key'));
			}
		});

		optionsField.destroy();

		done();
	});

	it('should serialize the options into a JSON', function(done) {
		var optionsField = new Liferay.DDM.Field.Options({
			localizable: false,
			value: [
				{
					label: {
						en_US: 'Bruno'
					},
					value: 'bruno'
				},
				{
					label: {
						en_US: 'Jadson'
					},
					value: 'jadson'
				}
			]
		}).render(document.body);

		var lastOptionField = optionsField.getLastField();

		lastOptionField.setValue('New');
		lastOptionField.set('key', 'new');

		var json = optionsField.toJSON();

		assert.lengthOf(json.value, 3);
		assert.equal(json.value[2].value, 'new');
		assert.equal(json.value[2].label[optionsField.get('locale')], 'New');

		optionsField.destroy();

		done();
	});
});