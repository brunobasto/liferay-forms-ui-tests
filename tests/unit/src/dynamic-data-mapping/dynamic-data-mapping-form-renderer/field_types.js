'use strict';

var assert = chai.assert;

describe('DDM Form Field Types Test Suite', function() {
	this.timeout(5000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				assert.ok(Liferay.DDM.Renderer.FieldTypes);

				done();
			}
		);
	});

	it('should register Field Types', function(done) {
		var A = AUI(),
			FieldTypes = Liferay.DDM.Renderer.FieldTypes;

		assert.fail(true, false, 'Unimplemented test.');

		done();
	});
});