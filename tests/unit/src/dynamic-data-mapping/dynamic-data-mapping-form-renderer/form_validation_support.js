'use strict';

var assert = chai.assert,
	server;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Form Validation Support', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-renderer',
			'liferay-form',
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

	it('should skip inexistent fields in the response', function(done) {
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

		try {
			form.validate(function(hasError) {
				assert.isFalse(hasError);

				form.destroy();

				done();
			});

			server.requests[0].respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				JSON.stringify(
					{
						fields: [
							{
								instanceId: 'inconsistent1',
								messages: ['First Name field is required'],
								name: 'first_name',
								valid: false
							},
							{
								instanceId: 'inconsistent2',
								messages: ['Last Name field is required'],
								name: 'last_name',
								valid: false
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
		});

		try {
			form.validate(function(hasError) {
				assert.isTrue(hasError);

				form.destroy();

				done();
			});

			server.requests[0].respond(
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

	it('should pass the validation when there is no validation expression defined', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc123',
					name: 'first_name',
					required: true,
					type: 'text'
				}),
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc321',
					name: 'last_name',
					required: true,
					type: 'text'
				})
			]
		});

		try {
			form.validate(function(hasError) {
				assert.isFalse(hasError);

				assert.lengthOf(server.requests, 0);

				form.destroy();

				done();
			});
		}
		catch (e) {
			done(e);
		}
	});

	it('should pass the field validation when there is no validation expression defined', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc123',
					name: 'first_name',
					required: true,
					type: 'text'
				}),
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc321',
					name: 'last_name',
					required: true,
					type: 'text'
				})
			]
		});

		try {
			var lastNameField = form.getField('last_name');

			lastNameField.validate(function(hasError) {
				assert.isFalse(hasError);

				assert.lengthOf(server.requests, 0);

				form.destroy();

				done();
			});
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
			form.validate(function(hasError) {
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

	it('should validate all the fields of the form when response is success', function(done) {
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

		try {
			form.validate(function(hasError) {
				assert.isTrue(hasError);

				form.destroy();

				done();
			});

			server.requests[0].respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				JSON.stringify(
					{
						fields: [
							{
								instanceId: 'abc123',
								messages: [
									'This field is required.'
								],
								name: 'first_name',
								valid: false
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

	it('should show error messages when validation doesn\'t pass', function(done) {
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

		try {
			form.validate(function(valid) {
				var firstNameField = form.getField('first_name');

				assert.lengthOf(firstNameField.get('validationMessages'), 1);

				form.destroy();

				done();
			});

			server.requests[0].respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				JSON.stringify(
					{
						fields: [
							{
								instanceId: 'abc123',
								messages: [
									'This field is required.'
								],
								name: 'first_name',
								valid: false
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

	it('should show default error message when no validation messages are present', function(done) {
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

		try {
			var field = form.getField('first_name');

			field.validate(function(valid) {
				var validationMessages = field.get('validationMessages');

				assert.lengthOf(validationMessages, 1);

				var strings = field.get('strings');

				assert.equal(validationMessages[0], strings.defaultValidationMessage);

				form.destroy();

				done();
			});

			server.requests[0].respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				JSON.stringify(
					{
						fields: [
							{
								instanceId: 'abc123',
								name: 'first_name',
								valid: false
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

	it('should focus the first field with error when validating the whole form', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'field1',
					name: 'first_name',
					required: true,
					type: 'text',
					validationExpression: 'false'
				}),
				new Liferay.DDM.Renderer.Field({
					instanceId: 'field2',
					name: 'last_name',
					required: true,
					type: 'text',
					validationExpression: 'false'
				})
			]
		});

		try {
			var firstNameField = form.getField('first_name');
			var lastNameField = form.getField('last_name');

			sinon.spy(firstNameField, 'focus');
			sinon.spy(lastNameField, 'focus');

			form.validate(function() {
				assert.isTrue(firstNameField.focus.calledOnce);
				assert.isFalse(lastNameField.focus.called);

				firstNameField.focus.restore();
				lastNameField.focus.restore();

				form.destroy();

				done();
			});

			server.requests[0].respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				JSON.stringify(
					{
						fields: [
							{
								instanceId: 'field1',
								messages: ['First Name field is required'],
								name: 'first_name',
								valid: false
							},
							{
								instanceId: 'field2',
								messages: ['Last Name field is required'],
								name: 'last_name',
								valid: false
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
		var A = AUI(),
			form = new Liferay.DDM.Renderer.Form({
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
			form.validate();

			assert.lengthOf(server.requests, 0);

			form.destroy();

			done();
		}
		catch (e) {
			done(e);
		}
	});

	it('should enable calling .validate() without a callback parameter but with validations', function(done) {
		var A = AUI(),
			form = new Liferay.DDM.Renderer.Form({
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

		try {
			form.validate();

			assert.lengthOf(server.requests, 1);

			server.requests[0].respond(
				404,
				{
					'Content-Type': 'text/plain'
				}
			);

			form.destroy();

			done();
		}
		catch (e) {
			done(e);
		}
	});
});