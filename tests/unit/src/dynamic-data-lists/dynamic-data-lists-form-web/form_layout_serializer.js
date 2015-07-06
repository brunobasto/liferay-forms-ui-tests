'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDL Layout Serializer', function() {
	this.timeout(120000);

	before(function(done) {
		chai.config.truncateThreshold = 0;

		AUI().use(
			'liferay-ddl-form-builder',
			'liferay-ddl-form-builder-layout-serializer',
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should serialize a given layout', function(done) {
		var A = AUI(),
			FieldTypes = Liferay.DDM.Renderer.FieldTypes,
			formBuilder = new Liferay.DDL.FormBuilder();

		var fields = [
			formBuilder.createField(FieldTypes.get('checkbox')),
			formBuilder.createField(FieldTypes.get('radio')),
			formBuilder.createField(FieldTypes.get('select')),
			formBuilder.createField(FieldTypes.get('text'))
		];

		fields[0].set('name', 'field0');
		fields[1].set('name', 'field1');
		fields[2].set('name', 'field2');
		fields[3].set('name', 'field3');

		var pages = [
			new A.Layout({
				rows: [
					new A.LayoutRow({
						cols: [
							new A.LayoutCol({
								size: 6,
								value: new A.FormBuilderFieldList({
									fields: [fields[0]]
								})
							}),
							new A.LayoutCol({
								size: 6,
								value: new A.FormBuilderFieldList({
									fields: [fields[1]]
								})
							})
						]
					}),
					new A.LayoutRow({
						cols: [
							new A.LayoutCol({
								size: 12,
								value: new A.FormBuilderFieldList({
									fields: [fields[2]]
								})
							})
						]
					})
				]
			}),
			new A.Layout({
				rows: [
					new A.LayoutRow({
						cols: [
							new A.LayoutCol({
								size: 12,
								value: new A.FormBuilderFieldList({
									fields: [fields[3]]
								})
							})
						]
					})
				]
			})
		];

		var serializer = new Liferay.DDL.LayoutSerializer({
			builder: formBuilder,
			pages: pages
		});

		try {
			assert.deepEqual(
				JSON.parse(serializer.serialize()),
				{
					"pages":[
						{
							"description": {
								"en_US":""
							},
							"rows":[
								{
									"columns":[
										{
											"size":6,
											"fieldNames":["field0"]
										},
										{
											"size":6,
											"fieldNames":["field1"]
										}
									]
								},
								{
									"columns":[
										{
											"size":12,
											"fieldNames":["field2"]
										}
									]
								}
							],
							"title":{
								"en_US":1
							}
						},
						{
							"description":{
								"en_US":""
							},
							"rows":[
								{
									"columns":[
										{
											"size":12,
											"fieldNames":["field3"]
										}
									]
								}
							],
							"title":{
								"en_US":2
							}
						}
					]
				}
			);

			done();
		}
		catch(e) {
			e.actual = JSON.stringify(e.actual);
			e.expected = JSON.stringify(e.expected);

			e.message = ['\n\n\tActual:\n\t', e.actual, '\n\tExpected:\n\t', e.expected, '\n'].join('\n');

			done(e);
		}
	});
});