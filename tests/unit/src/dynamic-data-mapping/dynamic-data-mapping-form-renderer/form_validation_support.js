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

	it('should validate all the fields of the form when response is success', function(done) {
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
			form.validate(function(valid) {
				assert.isFalse(valid);

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
					type: 'text'
				})
			]
		});

		try {
			form.validate(function(valid) {
				var firstNameField = form.getField('first_name');

				assert.lengthOf(firstNameField.get('errorMessages'), 1);

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
					type: 'text'
				})
			]
		});

		try {
			form.validate(function(valid) {
				var firstNameField = form.getField('first_name');

				var errorMessages = firstNameField.get('errorMessages');

				assert.lengthOf(errorMessages, 1);

				assert.equal(errorMessages[0], form.get('defaultErrorMessage'));

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

	it('should return false when there\'s an error with the request', function(done) {
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
			form.validate(function(valid) {
				assert.isFalse(valid);

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
});