'use strict';

var assert = chai.assert,
	server;

var getPassingValidationResponse = function(form) {
	var fields = [];

	form.eachField(function(field) {
		fields.push({
			messages: [],
			instanceId: field.get('instanceId'),
			name: field.get('name'),
			valid: true
		});
	});

	return JSON.stringify({
		fields: fields
	});
}

var createFieldWithName = function(formBuilder, type, name) {
	var fieldType = Liferay.DDM.Renderer.FieldTypes.get(type),
		field = formBuilder.createField(fieldType),
		settingsForm = field.get('settingsForm');

	var nameSettingsField = _.filter(
		settingsForm.get('fields'),
		function(settingsField) {
			return settingsField.get('name') === 'name';
		}
	)[0];

	nameSettingsField.setValue(name);

	return field;
}

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable.html'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_layout.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_values.json')
	).done(callback);
};

describe('DDL Form Builder Field Support', function() {
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

	it('should validate the settingsForm when calling field.validateSettings', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pages: test.layout.pages
			}
		).render();

		var field = formBuilder.getField('sites');

		formBuilder.showFieldSettingsPanel(field, field.get('name'));

		var settingsForm = field.get('settingsForm');

		sinon.spy(settingsForm, 'validate');

		field.validateSettings();

		server.requests[0].respond(
			404,
			{
				'Content-Type': 'application/json'
			}
		);

		assert.isTrue(settingsForm.validate.calledOnce);

		settingsForm.validate.restore();

		// TODO - Destroy Form Builder
		// This test case was mainly added to cover the branch where
		// validateSettings is called without any parameters.
		// Since validateSettings is async, if we destroy it now
		// it'll break

		done();
	});

	it('should create a field with a settingsForm with the fields specified by the FieldType definition', function(done) {
		var test = this,
			formBuilder = new Liferay.DDL.FormBuilder(),
			FieldTypes = Liferay.DDM.Renderer.FieldTypes;

		var fieldTypes = FieldTypes.getAll();

		_.each(fieldTypes, function(fieldType) {
			var field = formBuilder.createField(fieldType);

			var settingsForm = field.get('settingsForm');
			var settings = fieldType.get('settings');

			_.each(settingsForm.get('fields'), function(field, index) {
				assert.equal(field.get('name'), settings.fields[index].name);
			});
		});

		done();
	});

	it('should not render repeatable fields toolbar', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pages: test.layout.pages
			}
		).render();

		new Liferay.DDL.LayoutVisitor({
			pages: formBuilder.get('layouts'),
			fieldHandler: function(field) {
				if (field.get('repeatable')) {
					var toolbar = field.get('container').one('.lfr-ddm-form-field-repeatable-toolbar');

					assert.isTrue(toolbar.hasClass('hide'));
				}
			}
		}).visit();

		formBuilder.destroy();

		done();
	});

	it('should not allow saving a field with the same name as an existing field', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pages: test.layout.pages
			}
		).render();

		var fieldWithDuplicatedName = createFieldWithName(formBuilder, 'text', 'sites');

		fieldWithDuplicatedName.validateSettings(function(valid) {
			assert.isFalse(valid);

			formBuilder.destroy();

			done();
		});

		var settingsForm = fieldWithDuplicatedName.get('settingsForm');

		server.requests[0].respond(
			200,
			{
				'Content-Type': 'application/json'
			},
			getPassingValidationResponse(settingsForm)
		);
	});

	it('should allow editing a field', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pages: test.layout.pages
			}
		).render();

		var field = formBuilder.getField('sites');

		formBuilder.showFieldSettingsPanel(field, field.get('name'));

		field.validateSettings(function(valid) {
			assert.isTrue(valid);

			formBuilder.destroy();

			done();
		});

		var settingsForm = field.get('settingsForm');

		server.requests[0].respond(
			200,
			{
				'Content-Type': 'application/json'
			},
			getPassingValidationResponse(settingsForm)
		);
	});
});