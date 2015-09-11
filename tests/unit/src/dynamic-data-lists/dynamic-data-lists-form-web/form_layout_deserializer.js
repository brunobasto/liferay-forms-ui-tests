'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable.html'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_values.json')
	).done(callback);
};

describe('DDL Layout Deserializer', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		chai.config.truncateThreshold = 0;

		AUI().use(
			'liferay-ddl-form-builder',
			'liferay-ddl-form-builder-layout-deserializer',
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				getTestData(function(fieldTypes, markup, definition, values) {
					test.markup = markup[0];
					test.definition = definition[0];
					test.values = values[0];

					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes[0]);

					done();
				});
			}
		);
	});

	it('should deserialize a given layout JSON', function(done) {
		var test = this;

		var deserializer = new Liferay.DDL.LayoutDeserializer({
			builder: new Liferay.DDL.FormBuilder(),
			definition: test.definition,
			pages: [
				{
					"title":{
						"en_US": "Page One"
					},
					"description":{
						"en_US": "Description of page one."
					},
					"rows":[
						{
							"columns":[
								{
									"fieldNames": ["sites"],
									"size": 4
								},
								{
									"fieldNames": ["displayStyle"],
									"size": 4
								},
								{
									"fieldNames": [],
									"size": 4
								}
							]
						}
					]
				}
			]
		});

		var columns = [];
		var fields = [];
		var pages = [];
		var rows = [];

		new Liferay.DDL.LayoutVisitor({
			pages: deserializer.deserialize(),
			pageHandler: function(page) {
				pages.push(page);
			},
			rowHandler: function(row) {
				rows.push(row)
			},
			fieldHandler: function(field) {
				fields.push(field);
			},
			columnHandler: function(column) {
				columns.push(column);
			}
		}).visit();

		assert.lengthOf(pages, 1);
		assert.lengthOf(rows, 1);
		assert.lengthOf(columns, 3);
		assert.lengthOf(fields, 2);

		assert.deepEqual(deserializer.get('titles'), ['Page One']);
		assert.deepEqual(deserializer.get('descriptions'), ['Description of page one.']);

		done();
	});

	it('should deserialize an empty layout JSON', function(done) {
		var test = this;

		var emptyPage = new Liferay.DDL.LayoutDeserializer({
			builder: new Liferay.DDL.FormBuilder(),
			definition: test.definition,
			pages: []
		}).deserialize();

		assert.isDefined(emptyPage);

		done();
	});
});