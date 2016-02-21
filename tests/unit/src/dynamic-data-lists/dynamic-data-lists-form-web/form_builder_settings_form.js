'use strict';

var assert = chai.assert;
var server;

var getFailingValidationResponse = function(form) {
	var fields = [];

	form.eachField(
		function(field) {
			fields.push(
				{
					errorMessage: 'Some error',
					instanceId: field.get('instanceId'),
					name: field.get('name'),
					valid: false,
					visible: true
				}
			);
		}
	);

	return JSON.stringify(
		{
			fields: fields
		}
	);
};

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable.html'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_layout.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_values.json')
	).done(callback);
};

describe('DDL Form Builder Settings Form', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		chai.config.truncateThreshold = 0;

		AUI().use(
			'liferay-ddl-form-builder',
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				getTestData(function(fieldTypes, markup, definition, layout, values) {
					test.markup = markup[0];
					test.definition = definition[0];
					test.layout = layout[0];
					test.values = values[0];

					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes[0]);

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

	it('should show the loading feedback on the modal footer submit button', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pagesJSON: test.layout.pages
			}
		).render();

		var field = formBuilder.getField('sites');

		field.render();

		formBuilder.showFieldSettingsPanel(field, field.get('name'));

		var settingsForm = field.get('settingsForm');

		settingsForm.render();

		settingsForm.showLoadingFeedback();

		var settingsModal = field.getSettingsModal();

		assert.ok(settingsModal._modal.getStdModNode('footer').one('.icon-spinner'));

		done();
	});

	it(
		'should show advanced options when clicking on "Show more options"',
		function(done) {
			var test = this;

			var formBuilder = new Liferay.DDL.FormBuilder(
				{
					definition: test.definition,
					pagesJSON: test.layout.pages
				}
			).render();

			var field = formBuilder.getField('sites');

			field.render();

			formBuilder.showFieldSettingsPanel(field, field.get('name'));

			var settingsForm = field.get('settingsForm');

			settingsForm.render();

			var container = settingsForm.get('container');

			var advancedPage = container.one('.lfr-ddm-form-page.advanced');

			assert.isFalse(advancedPage.hasClass('active'));

			settingsForm.modeToggler.simulate('click');

			assert.isTrue(advancedPage.hasClass('active'));

			done();
		}
	);

	it('should validate the settingsForm when calling validateSettings', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pagesJSON: test.layout.pages
			}
		).render();

		var field = formBuilder.getField('sites');

		field.render();

		formBuilder.showFieldSettingsPanel(field, field.get('name'));

		var settingsForm = field.get('settingsForm');

		settingsForm.render();

		sinon.spy(settingsForm, 'validate');

		settingsForm.validateSettings();

		assert.isTrue(settingsForm.validate.calledOnce);

		settingsForm.validate.restore();

		// TODO - Destroy Form Builder
		// This test case was mainly added to cover the branch where
		// validateSettings is called without any parameters.
		// Since validateSettings is async, if we destroy it now
		// it'll break

		setTimeout(function() {
			settingsForm.destroy();

			formBuilder.destroy();

			done();
		}, 100);
	});

	it(
		'should allow calling .validateSettings without a callback',
		function(done) {
			var instance = this;

			var formBuilder = new Liferay.DDL.FormBuilder(
				{
					definition: instance.definition,
					pagesJSON: instance.layout.pages
				}
			).render();

			var field = formBuilder.getField('sites');

			formBuilder.showFieldSettingsPanel(field, field.get('name'));

			var settingsForm = field.get('settingsForm');

			var firstField = settingsForm.get('fields')[0];

			firstField.set('validation.expression', 'false');

			settingsForm.validateSettings();

			server.requests.pop().respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				getFailingValidationResponse(settingsForm)
			);

			setTimeout(
				function() {
					assert.isTrue(firstField.hasErrors());

					done();
				},
				200
			);
		}
	);

	it('should prevent settings form submission when validation does not pass', function(done) {
		var instance = this;

		var A = AUI();

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: instance.definition,
				pagesJSON: instance.layout.pages
			}
		).render();

		var field = formBuilder.getField('sites');

		formBuilder.showFieldSettingsPanel(field, field.get('name'));

		var settingsForm = field.get('settingsForm');

		var firstField = settingsForm.get('fields')[0];

		// Adding an expression so that a request is sent when validating
		firstField.set('validation.expression', 'false');

		var formNode = settingsForm.get('container');

		sinon.spy(settingsForm, 'submit');

		var restore = function() {
			settingsForm.submit.restore();

			settingsForm.destroy();

			formNode.remove();
		};

		try {
			formNode.simulate('submit');

			assert.isTrue(settingsForm.submit.called);

			server.requests.pop().respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				getFailingValidationResponse(settingsForm)
			);

			setTimeout(
				function() {
					restore();

					// Assert page was not reloaded
					assert.isTrue(true);

					instance.submit

					done();
				}
			);
		}
		catch (e) {
			restore();

			done(e);
		}
	});
});