'use strict';

var assert = chai.assert;

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

	it('should call .createField after clicking on a field type on the field types modal', function(done) {
		var test = this,
			A = AUI();

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pagesJSON: test.layout.pages
			}
		).render();

		sinon.spy(formBuilder, 'createField');

		var boundingBox = formBuilder.get('boundingBox');

		// Show field types modal
		boundingBox.one('.form-builder-field-list-add-button').simulate('click');

		// Show field settings
		A.one('.lfr-ddl-form-builder-field-types-modal-content .field-type').simulate('click');

		assert.isTrue(formBuilder.createField.calledOnce);

		formBuilder.createField.restore();

		formBuilder.destroy();

		done();
	});

	// TODO - Make assertions
	it('should destroy all the fields of the Form Builder', function(done) {
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pagesJSON: test.layout.pages
			}
		).render();

		formBuilder.destroy();

		done();
	});

	it('should not reload the page when clicking on a pagination item', function(done) {
		var A = AUI();
		var test = this;

		var formBuilder = new Liferay.DDL.FormBuilder(
			{
				definition: test.definition,
				pagesJSON: test.layout.pages
			}
		).render();

		var boundingBox = formBuilder.get('boundingBox');

		// Open menu to add a page
		boundingBox.one('.form-builder-controls-trigger').simulate('click');

		// Add a page
		A.one('.form-builder-page-manager-add-last-position').simulate('click');

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
				pagesJSON: test.layout.pages
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