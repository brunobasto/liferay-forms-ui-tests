'use strict';

var assert = chai.assert;

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

	it('should allow saving a field with the same name an existing field', function(done) {
		var test = this,
			FieldTypes = Liferay.DDM.Renderer.FieldTypes

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pages: test.layout.pages
			}
		).render();

		var fields = formBuilder.getFields();

		var field = formBuilder.createField(FieldTypes.get('text'));

		var settingsForm = field.get('settingsForm');

		var nameSettingsField = _.filter(settingsForm.get('fields'), function(settingsField) {
			return settingsField.get('name') === 'name';
		})[0];

		nameSettingsField.setValue('sites');

		assert.isFalse(field.validateSettings(), 'Validation should not pass');

		field.saveSettings();

		assert.equal(fields.length, formBuilder.getFields().length, 'Field should have not been added');

		formBuilder.destroy();

		done();
	});

	it('should allow editing a field', function(done) {
		var test = this,
			FieldTypes = Liferay.DDM.Renderer.FieldTypes

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pages: test.layout.pages
			}
		).render();

		var fields = formBuilder.getFields();

		var field = formBuilder.getField('sites');

		field.renderSettingsPanel(document.body);

		assert.isTrue(field.validateSettings(), 'Validation should pass');

		field.saveSettings();

		assert.equal(fields.length, formBuilder.getFields().length, 'Lengths should equal');

		formBuilder.destroy();

		done();
	});
});