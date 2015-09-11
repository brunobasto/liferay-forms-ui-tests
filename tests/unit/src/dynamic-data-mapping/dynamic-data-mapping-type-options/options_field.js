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

		var inputs = optionsField.get('container').all('input[type="text"]');

		var value = optionsField.get('value');

		inputs.each(function(input, index) {
			var isLabel = index % 2 === 0,
				valueIndex = Math.floor(index / 2);

			if (isLabel) {
				assert.equal(value[valueIndex].label[optionsField.get('locale')], input.val());
			}
			else {
				assert.equal(value[valueIndex].value, input.val());
			}
		});

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
		}).render();

		var container = optionsField.get('container');

		container.one('.add-row').simulate('click');

		var inputs = optionsField.get('container').all('input[type="text"]');

		inputs.item(4).val('New');
		inputs.item(5).val('new');

		var json = optionsField.toJSON();

		assert.lengthOf(json.value, 3);
		assert.equal(json.value[2].value, 'new');
		assert.equal(json.value[2].label[optionsField.get('locale')], 'New');

		done();
	});
});