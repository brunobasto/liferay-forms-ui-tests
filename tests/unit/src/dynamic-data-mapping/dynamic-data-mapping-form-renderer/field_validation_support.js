'use strict';

var assert = chai.assert,
	server;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Field Validation Support', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-renderer-field',
			'liferay-ddm-form-renderer-field-validation',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	beforeEach(function(done) {
		server = sinon.fakeServer.create();

		done();
	});

	afterEach(function(done) {
		server.restore();

		done();
	});

	it('should handle problems with the request when calling .validate()', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc123',
					name: 'first_name',
					required: true,
					type: 'text',
					validationExpression: 'false'
				})
			]
		}).render();

		try {
			var field = form.getField('first_name');

			field.validate(function(hasError) {
				assert.isTrue(hasError);

				form.destroy();

				done();
			});

			server.requests.pop().respond(
				404,
				{
					'Content-Type': 'text/plain'
				}
			);
		}
		catch (e) {
			done(e);
		}
	});

	it('should handle non JSON responses gracefully for .validate()', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc123',
					name: 'first_name',
					required: true,
					type: 'text',
					validationExpression: 'false'
				})
			]
		});

		var field = form.getField('first_name');

		try {
			field.validate(function(hasError) {
				assert.isTrue(hasError);

				assert.isNull(field.get('container').one('.form-control-feedback'));

				form.destroy();

				done();
			});

			server.requests[0].respond(
				200,
				{
					'Content-Length': '0',
					'Content-Type': 'text/plain'
				}
			);
		}
		catch (e) {
			done(e);
		}
	});

	it('should validate only the desired field after calling .validate()', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'field1',
					name: 'first_name',
					required: true,
					type: 'text',
					validation: {
						expression: 'false'
					}
				}),
				new Liferay.DDM.Renderer.Field({
					instanceId: 'field2',
					name: 'last_name',
					required: true,
					type: 'text',
					validation: {
						expression: '!last_name.equals("")'
					}
				})
			]
		}).render();

		try {
			var firstNameField = form.getField('first_name');
			var lastNameField = form.getField('last_name');

			lastNameField.validate(function() {
				assert.equal(firstNameField.get('errorMessage'), '');
				assert.equal(lastNameField.get('errorMessage'), 'Last Name field is required');

				form.destroy();

				done();
			});

			server.requests.pop().respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				JSON.stringify(
					{
						fields: [
							{
								errorMessage: 'First Name field is required',
								instanceId: 'field1',
								name: 'first_name',
								valid: false,
								visible: true
							},
							{
								errorMessage: 'Last Name field is required',
								instanceId: 'field2',
								name: 'last_name',
								valid: false,
								visible: true
							}
						]
					}
				)
			);
		}
		catch (e) {
			done(e);
		}
	});

	it('should enable calling .validate() without a callback parameter', function(done) {
		var A = AUI();

		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc123',
					name: 'first_name',
					required: true,
					type: 'text'
				})
			]
		});

		try {
			var field = form.getField('first_name');

			field.validate();

			var evaluator = field.get('evaluator');

			assert.isTrue(evaluator.evaluating());

			form.destroy();

			done();
		}
		catch (e) {
			done(e);
		}
	});
});