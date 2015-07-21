'use strict';

var assert = chai.assert;

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

	it('should render a TabView after it\'s rendered', function(done) {
		var form = new Liferay.DDM.Renderer.Form().render();

		var tabView = form.getTabView();

		assert.isTrue(tabView.get('rendered'), 'TabView should be rendered.');

		done();
	});

	it('should serialize a JSON with "availableLanguageIds", "defaultLanguageId" and "fieldValues" attributes', function(done) {
		var form = new Liferay.DDM.Renderer.Form().render();

		var json = form.toJSON();

		assert.lengthOf(_.keys(json), 3);
		assert.property(json, 'availableLanguageIds');
		assert.property(json, 'defaultLanguageId');
		assert.property(json, 'fieldValues');

		done();
	});

	it('should re-append the nested fields after the container changes', function(done) {
		var A = AUI();

		var field = new Liferay.DDM.Renderer.Field({
			type: 'text'
		});

		var form = new Liferay.DDM.Renderer.Form({
			fields: [field]
		});

		var newContainer = new A.Node.create('<div></div>');

		form.set('container', newContainer);

		assert.isTrue(newContainer.contains(field.get('container')), 'New container should contain field container');

		done();
	});
});