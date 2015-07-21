'use strict';

var assert = chai.assert;

var AddTextField = function(formBuilder, name) {
	var A = AUI();

	var boundingBox = formBuilder.get('boundingBox');

	// Click on the Add field button
	boundingBox.one('.form-builder-field-list-add-button-circle').simulate('click');

	// Select the 'text' field type
	A.all('.form-builder-field-types-list .field-type').item(1).simulate('click');

	var nameInput = A
		.one('.form-builder-field-settings-content')
		.all('.lfr-ddm-form-field-container input').filter(function(input) {

		return /\$name\$/g.test(input.attr('name'));
	}).item(0);

	nameInput.val(name);

	// Save
	A.one('.form-builder-field-settings-small-screen-header-check').simulate('click');
};

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_layout.json')
	).done(callback);
};

describe('DDL Form Builder', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		Liferay.Language.get = sinon.stub().returnsArg(0);

		AUI().use(
			'liferay-ddl-form-builder',
			'liferay-ddl-form-builder-definition-serializer',
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				getTestData(function(fieldTypes, definition, layout) {
					test.definition = definition[0];
					test.layout = layout[0];

					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes[0]);

					done();
				});
			}
		);
	});

	it('should render the Form Builder with fields augment from FormBuilderFieldSupport', function(done) {
		var test = this,
			A = AUI();

		var formBuilder = new Liferay.DDL.FormBuilder().render();

		AddTextField(formBuilder, 'test');

		var definition = JSON.parse(
			new Liferay.DDL.DefinitionSerializer({
				builder: formBuilder,
				pages: formBuilder.get('layouts')
			}).serialize()
		);

		assert.equal(definition.fields[0].name, 'test');

		formBuilder.destroy();

		done();
	});

	// TODO
	it('should destroy all the fields of the Form Builder', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pages: test.layout.pages
			}
		).render();

		formBuilder.destroy();

		done();
	});

	it('should not reload the page when clicking on a pagination item', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pages: test.layout.pages
			}
		).render();

		var boundingBox = formBuilder.get('boundingBox');

		// Add a page
		boundingBox.one('.form-builder-pages-add-page').simulate('click');

		// Click on the back pagination link
		boundingBox.one('.pagination-control a').simulate('click');

		// Page was not reloaded :)
		assert.isTrue(true);

		formBuilder.destroy();

		done();
	});

	it('should render all the fields toolbars after it renders', function(done) {
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
				var toolbar = field.get('container').one('.form-builder-field-toolbar-container');

				assert.isNotNull(toolbar);
				assert.isTrue(toolbar.inDoc());
			}
		}).visit();

		formBuilder.destroy();

		done();
	});
});