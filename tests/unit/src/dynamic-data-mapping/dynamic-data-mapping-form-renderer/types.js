'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Field Types', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		AUI().use(
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				getTestData(function(fieldTypes) {
					test.fieldTypes = fieldTypes;

					done();
				});
			}
		);
	});

	it('should register all Field Types', function(done) {
		var test = this,
			FieldTypes = Liferay.DDM.Renderer.FieldTypes;

		FieldTypes.register(test.fieldTypes);

		_.each(FieldTypes.getAll(), function(fieldType, index) {
			assert.equal(fieldType.get('name'), test.fieldTypes[index].name);
		});

		done();
	});
});