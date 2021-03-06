'use strict';

var assert = chai.assert,
	server;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

var simulateFieldChange = function(field) {
	field._onInputChange();
};

describe('DDM Renderer Field Visibility Support', function() {
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

	beforeEach(function(done) {
		server = sinon.fakeServer.create();

		done();
	});

	afterEach(function(done) {
		server.restore();

		done();
	});

	it('should change the visibility of a field when another field triggers evaluation', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'field1',
					name: 'first_name',
					required: true,
					type: 'text',
					visible: false,
					visibilityExpression: 'false'
				}),
				new Liferay.DDM.Renderer.Field({
					instanceId: 'field2',
					name: 'last_name',
					required: true,
					type: 'text',
					visible: true,
					visibilityExpression: 'false'
				})
			]
		}).render(document.body);

		try {
			var firstNameField = form.getField('first_name');
			var lastNameField = form.getField('last_name');

			assert.isFalse(firstNameField.get('visible'));
			assert.isTrue(lastNameField.get('visible'));

			lastNameField.setValue('Basto');
			simulateFieldChange(lastNameField);

			var ajax = server.requests.pop();

			assert.equal(ajax.url, '/o/dynamic-data-mapping-form-evaluator/');

			ajax.respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				JSON.stringify(
					{
						fields: [
							{
								instanceId: 'field1',
								name: 'first_name',
								visible: false
							},
							{
								instanceId: 'field2',
								name: 'last_name',
								visible: true
							}
						]
					}
				)
			);

			setTimeout(function() {
				assert.isFalse(firstNameField.get('visible'));
				assert.isTrue(lastNameField.get('visible'));

				form.destroy();

				form.get('container').remove();

				done();
			}, 100);
		}
		catch (e) {
			done(e);
		}
	});
});