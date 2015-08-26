'use strict';

var assert = chai.assert,
	server;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Form Tabs Support', function() {
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

	it('should render a TabView after calling .render() if node is present', function(done) {
		var A = AUI(),
			container = A.Node.create('<div><div class="lfr-ddm-form-tabs"></div></div>');

		var form = new Liferay.DDM.Renderer.Form({
			container: container
		});

		var tabView = form.getTabView();

		assert.isFalse(tabView.get('rendered'), 'TabView should not be rendered yet');

		form.render();

		assert.isTrue(tabView.get('rendered'), 'TabView should be rendered now');

		form.destroy();

		done();
	});
});