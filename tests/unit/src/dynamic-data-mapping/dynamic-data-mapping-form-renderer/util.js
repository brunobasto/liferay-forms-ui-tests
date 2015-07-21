'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_values.json')
	).done(callback);
};

describe('DDM Renderer Util', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		AUI().use(
			'liferay-ddm-form-renderer-util',
			function(A) {
				getTestData(function(fieldTypes, definition, values) {
					test.definition = definition[0];
					test.values = values[0];

					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes[0]);

					done();
				});
			}
		);
	});

	it('should generate a random instanceId with only letters and numbers with the desired length', function(done) {
		var Util = Liferay.DDM.Renderer.Util;

		var instanceId = Util.generateInstanceId(5);

		assert.match(instanceId, /\w+/);
		assert.lengthOf(instanceId, 5);

		done();
	});

	it('should retrieve a single field from a definition', function(done) {
		var test = this,
			Util = Liferay.DDM.Renderer.Util;

		var fieldData = Util.getFieldByKey(test.definition, 'sites');

		assert.isDefined(fieldData);
		assert.equal(fieldData.name, 'sites');

		done();
	});

	it('should retrieve a single field from a definition with nested fields', function(done) {
		var test = this,
			Util = Liferay.DDM.Renderer.Util;

		var fieldData = Util.getFieldByKey({
			'fields':[
				{
					'name':'displayStyle',
				},
				{
					'name':'sites',
					'nestedFields': [
						{
							'name': 'nestedOne'
						},
						{
							'name': 'nestedTwo',
							'nestedFields': [
								{
									'name': 'moreNested',
									'nestedFields': [
										{
											'name': 'findMe'
										}
									]
								}
							]
						}
					]
				}
			]
		}, 'findMe');

		assert.isDefined(fieldData);
		assert.equal(fieldData.name, 'findMe');

		done();
	});

	it('should retrieve a single value from values with nested fields', function(done) {
		var test = this,
			Util = Liferay.DDM.Renderer.Util;

		var fieldData = Util.getFieldByKey({
			'fieldValues':[
				{
					'name':'displayStyle',
				},
				{
					'name':'sites',
					'nestedFieldValues': [
						{
							'name': 'nestedOne'
						},
						{
							'name': 'nestedTwo',
							'nestedFieldValues': [
								{
									'name': 'moreNested',
									'nestedFieldValues': [
										{
											'name': 'findMe'
										}
									]
								}
							]
						}
					]
				}
			]
		}, 'findMe');

		assert.isDefined(fieldData);
		assert.equal(fieldData.name, 'findMe');

		done();
	});
});