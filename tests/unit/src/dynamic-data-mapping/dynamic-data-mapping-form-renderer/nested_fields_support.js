'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Nested Fields Support', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-renderer',
			'liferay-ddm-form-renderer-field',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should insert a field at position 0 when fields array is empty', function(done) {
		var form = new Liferay.DDM.Renderer.Form();

		var field = new Liferay.DDM.Renderer.Field({ type: 'text' });

		form.insert(0, field);

		var fields = form.get('fields');

		assert.lengthOf(fields, 1, 'Field should have been inserted');
		assert.equal(fields[0], field, 'Inserted field and actual field should match');

		form.destroy();

		done();
	});

	it('should insert the field at the end when index is greater then fields length', function(done) {
		var form = new Liferay.DDM.Renderer.Form();

		var field = new Liferay.DDM.Renderer.Field({ type: 'text' });

		form.insert(10, field);

		assert.equal(form.get('fields').pop(), field, 'Field should have been inserted at the end');

		form.destroy();

		done();
	});

	it('should insert a field at the desired position', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({ type: 'text' }),
				new Liferay.DDM.Renderer.Field({ type: 'text' })
			]
		});

		var field = new Liferay.DDM.Renderer.Field({ type: 'text' });

		form.insert(1, field);

		var fields = form.get('fields');

		assert.lengthOf(fields, 3, 'Field should have been inserted');
		assert.equal(fields[1], field, 'Inserted field and actual field should match');

		form.destroy();

		done();
	});

	it('should be able to retrieve a field by name', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({ name: 'bruno', type: 'text' }),
				new Liferay.DDM.Renderer.Field({ name: 'marcellus', type: 'text' }),
				new Liferay.DDM.Renderer.Field({
					name: 'thiago',
					type: 'text',
					fields: [
						new Liferay.DDM.Renderer.Field({ name: 'adam', type: 'text' }),
						new Liferay.DDM.Renderer.Field({
							name: 'eduardo',
							type: 'text',
							fields: [
								new Liferay.DDM.Renderer.Field({ name: 'henrique', type: 'text' }),
							]
						})
					]
				})
			]
		});

		var field = form.getField('henrique');

		assert.isDefined(field);
		assert.equal(field.get('name'), 'henrique');

		form.destroy();

		done();
	});
});