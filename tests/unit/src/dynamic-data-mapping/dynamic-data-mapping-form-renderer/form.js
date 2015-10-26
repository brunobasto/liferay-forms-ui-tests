'use strict';

var assert = chai.assert,
	server;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Form', function() {
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

	it('should serialize a JSON with "availableLanguageIds", "defaultLanguageId" and "fieldValues" attributes', function(done) {
		var form = new Liferay.DDM.Renderer.Form();

		var json = form.toJSON();

		assert.lengthOf(_.keys(json), 3);
		assert.property(json, 'availableLanguageIds');
		assert.property(json, 'defaultLanguageId');
		assert.property(json, 'fieldValues');

		form.destroy();

		done();
	});

	it('should prevent form submission when validation does not pass', function(done) {
		var A = AUI();

		var formNode = A.Node.create('<form action="javascript:;"></form>');

		formNode.appendTo(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			container: formNode,
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc123',
					name: 'first_name',
					required: true,
					type: 'text',
					validation: {
						expression: 'false'
					}
				})
			]
		});

		sinon.spy(form, 'validate');

		var restore = function() {
			form.validate.restore();

			form.destroy();

			formNode.remove();
		};

		try {
			formNode.simulate('submit');

			assert.isTrue(form.validate.calledOnce);

			server.requests.pop().respond(
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
								valid: false,
								visible: true
							}
						]
					}
				)
			);

			setTimeout(function() {
				restore();

				// Assert page was not reloaded
				assert.isTrue(true);

				done();
			});
		}
		catch (e) {
			restore();

			done(e);
		}
	});

	it('should submit the form when validation passes', function(done) {
		var A = AUI(),
			formNode = A.Node.create('<form name="test" action="javascript:;"><button type="submit" /></form>');

		formNode.appendTo(document.body);

		var original = Liferay.DDM.Renderer.Form.prototype.getFormNode;

		Liferay.DDM.Renderer.Form.prototype.getFormNode = function() {
			return formNode;
		};

		var form = new Liferay.DDM.Renderer.Form({
			container: formNode,
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

		sinon.spy(form, 'validate');

		var restore = function() {
			Liferay.DDM.Renderer.Form.prototype.getFormNode = original;

			form.validate.restore();

			form.destroy();

			formNode.remove();
		};

		try {
			formNode.submit = sinon.spy();

			formNode.simulate('submit');

			assert.isTrue(form.validate.calledOnce, 'should call .validate()');

			server.requests.pop().respond(
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
								valid: true
							}
						]
					}
				)
			);

			setTimeout(function() {
				assert.isTrue(formNode.submit.called, 'should try to submit the form');

				restore();

				done();
			}, 100);
		}
		catch (e) {
			restore();

			done(e);
		}
	});

	it('should prevent liferay form submission when validation does not pass', function(done) {
		var A = AUI();

		var formNode = A.Node.create('<form name="myForm" id="myForm" action="javascript:;"><button type="submit" /></form>');

		formNode.appendTo(document.body);

		Liferay.Form.register({
			id: 'myForm'
		});

		var form = new Liferay.DDM.Renderer.Form({
			container: formNode,
			fields: [
				new Liferay.DDM.Renderer.Field({
					instanceId: 'abc123',
					name: 'first_name',
					required: true,
					type: 'text',
					validation: {
						expression: 'false'
					}
				})
			]
		}).render();

		sinon.spy(form, 'validate');

		var restore = function() {
			form.validate.restore();

			form.destroy();

			formNode.remove();
		};

		try {
			formNode.simulate('submit');

			// Liferay.Form submission is async :/
			setTimeout(function() {
				assert.isTrue(form.validate.called, 'Validation should have been triggered');
				assert.isTrue(form.validate.calledOnce, 'Validation should have been triggered only once');

				server.requests.pop().respond(
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
									valid: false,
									visible: true
								}
							]
						}
					)
				);

				setTimeout(function() {
					restore();

					// Assert page was not reloaded
					assert.isTrue(true);

					done();
				}, 100);
			}, 100);
		}
		catch (e) {
			restore();

			done(e);
		}
	});
});