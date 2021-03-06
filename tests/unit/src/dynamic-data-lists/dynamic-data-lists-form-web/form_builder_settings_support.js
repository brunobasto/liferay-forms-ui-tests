'use strict';

var assert = chai.assert,
	server;

var getPassingValidationResponse = function(form) {
	var fields = [];

	form.eachField(function(field) {
		fields.push({
			instanceId: field.get('instanceId'),
			errorMessage: '',
			name: field.get('name'),
			valid: true,
			visible: true
		});
	});

	return JSON.stringify({
		fields: fields
	});
}

var createField = function(formBuilder, type) {
	var fieldType = Liferay.DDM.Renderer.FieldTypes.get(type),
		field = formBuilder.createField(fieldType);

	return field;
}

var setFieldSetting = function(field, setting, value) {
	var nameSettingsField = _.filter(
		field.get('settingsForm').get('fields'),
		function(settingsField) {
			return settingsField.get('name') === setting;
		}
	)[0].setValue(value);
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

describe('DDL Form Builder Settings Support', function() {
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
				pagesJSON: test.layout.pages
			}
		).render();

		new Liferay.DDL.LayoutVisitor({
			pages: formBuilder.get('layouts'),
			fieldHandler: function(field) {
				if (field.get('repeatable')) {
					var toolbar = field.get('container').one('.lfr-ddm-form-field-repeatable-toolbar');

					assert.notOk(toolbar);
				}
			}
		}).visit();

		formBuilder.destroy();

		done();
	});

	it(
		'should not allow saving a field with the same name as an existing field',
		function(done) {
			var instance = this;

			var formBuilder = new Liferay.DDL.FormBuilder(
				{
					definition: instance.definition,
					pagesJSON: instance.layout.pages
				}
			).render();

			var fieldWithDuplicatedName = createField(formBuilder, 'text', 'sites');

			formBuilder.showFieldSettingsPanel(fieldWithDuplicatedName, fieldWithDuplicatedName.get('name'));

			setFieldSetting(fieldWithDuplicatedName, 'name', 'sites');

			var settingsForm = fieldWithDuplicatedName.get('settingsForm');

			settingsForm.validateSettings(
				function(hasErrors) {
					assert.isTrue(hasErrors);

					formBuilder.destroy();

					server.restore();

					done();
				}
			);

			var settingsForm = fieldWithDuplicatedName.get('settingsForm');

			server.requests.pop().respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				getPassingValidationResponse(settingsForm)
			);
		}
	);

	it('should allow editing a field', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pagesJSON: test.layout.pages
			}
		).render();

		var field = formBuilder.getField('sites');

		formBuilder.showFieldSettingsPanel(field, field.get('name'));

		var settingsForm = field.get('settingsForm');

		settingsForm.validateSettings(function(hasError) {
			assert.isFalse(hasError);

			formBuilder.destroy();

			server.restore();

			done();
		});

		server.requests.pop().respond(
			200,
			{
				'Content-Type': 'application/json'
			},
			getPassingValidationResponse(settingsForm)
		);
	});
});