'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDL Layout Visitor', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddl-form-builder',
			'liferay-ddl-form-builder-layout-visitor',
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should visit all the fields of all the pages of a given layout', function(done) {
		var A = AUI(),
			FieldTypes = Liferay.DDM.Renderer.FieldTypes,
			formBuilder = new Liferay.DDL.FormBuilder();

		var fields = [
			formBuilder.createField(FieldTypes.get('checkbox')),
			formBuilder.createField(FieldTypes.get('radio')),
			formBuilder.createField(FieldTypes.get('select')),
			formBuilder.createField(FieldTypes.get('text'))
		];

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

		var visited = [];

		var visitor = new Liferay.DDL.LayoutVisitor({
			pages: pages,
			fieldHandler: function(field) {
				visited.push(field);
			}
		});

		visitor.visit();

		assert.lengthOf(visited, fields.length, 'Should have visited all fields');

		formBuilder.destroy();

		done();
	});
});