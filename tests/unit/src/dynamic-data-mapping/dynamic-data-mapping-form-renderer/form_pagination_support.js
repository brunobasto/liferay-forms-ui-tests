'use strict';

var assert = chai.assert,
	server;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_multiple_pages.html'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_multiple_pages_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_multiple_pages_layout.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_single_page.html'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_single_page_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_single_page_layout.json')
	).done(callback);
};

var isVisible = function(node) {
	return !node.hasClass('hide') || node.getStyle('display') !== 'none';
};

describe('DDM Renderer Form Pagination Support', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		AUI().use(
			'liferay-ddm-form-renderer',
			function(A) {
				getTestData(
					function(fieldTypes, multiplePageMarkup, multiplePageDefinition, multiplePageLayout, singlePageMarkup, singlePageDefinition, singlePageLayout) {
						test.multiplePageMarkup = multiplePageMarkup[0];
						test.multiplePageDefinition = multiplePageDefinition[0];
						test.multiplePageLayout = multiplePageLayout[0];
						test.singlePageMarkup = singlePageMarkup[0];
						test.singlePageDefinition = singlePageDefinition[0];
						test.singlePageLayout = singlePageLayout[0];

						Liferay.DDM.Renderer.FieldTypes.register(fieldTypes[0]);

						done();
					}
				);
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

	it('should show control buttons correctly with multiple page forms', function(done) {
		var A = AUI(),
			test = this,
			container = A.Node.create(test.multiplePageMarkup);

		container.appendTo(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			container: container,
			definition: test.multiplePageDefinition,
			layout: test.multiplePageLayout
		}).render();

		var nextBtn = container.one('.lfr-ddm-form-pagination-next');
		var prevBtn = container.one('.lfr-ddm-form-pagination-prev');
		var submitBtn = container.one('.lfr-ddm-form-submit');

		var respond = function() {
			var fields = [];

			form.eachField(function(field) {
				fields.push({
					instanceId: field.get('instanceId'),
					name: field.get('name'),
					valid: true,
					visible: true
				});
			});

			server.requests.pop().respond(
				200,
				{
					'Content-Type': 'application/json'
				},
				JSON.stringify(
					{
						fields: fields
					}
				)
			);
		}

		form.getPagination().on('changeRequest', respond);

		// On page one
		assert.isTrue(isVisible(nextBtn));
		assert.isFalse(isVisible(prevBtn));
		assert.isFalse(isVisible(submitBtn));

		form.getPagination().after('pageChange', function(event) {
			if (event.newVal == 2) {
				// On page two
				assert.isTrue(isVisible(nextBtn));
				assert.isTrue(isVisible(prevBtn));
				assert.isFalse(isVisible(submitBtn));

				form.nextPage();
			}
			else if (event.newVal == 3) {
				// On last page
				assert.isFalse(isVisible(nextBtn));
				assert.isTrue(isVisible(prevBtn));
				assert.isTrue(isVisible(submitBtn));

				form.destroy();
				done();
			}
		});

		form.nextPage();
	});

	it('should show control buttons correctly with single page forms', function(done) {
		var A = AUI(),
			test = this,
			container = A.Node.create(test.singlePageMarkup);

		container.appendTo(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			container: container,
			definition: test.singlePageDefinition,
			layout: test.singlePageLayout
		}).render();

		var nextBtn = container.one('.lfr-ddm-form-pagination-next');
		var prevBtn = container.one('.lfr-ddm-form-pagination-prev');
		var submitBtn = container.one('.lfr-ddm-form-submit');

		assert.isFalse(isVisible(nextBtn));
		assert.isFalse(isVisible(prevBtn));
		assert.isTrue(isVisible(submitBtn));

		form.destroy();

		done();
	});

	it('should not go to the next page if validation fails', function(done) {
		var A = AUI(),
			test = this,
			container = A.Node.create(test.multiplePageMarkup);

		container.appendTo(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			container: container,
			definition: test.multiplePageDefinition,
			layout: test.multiplePageLayout
		}).render();

		var firstPageField = form.getFirstPageField();

		// Make it "required"
		firstPageField.set('validation.expression', ['!', firstPageField.get('name'), '.equals("")'].join(''));

		form.nextPage();

		server.requests.pop().respond(
			200,
			{
				'Content-Type': 'application/json'
			},
			JSON.stringify(
				{
					fields: [
						{
							instanceId: firstPageField.get('instanceId'),
							name: firstPageField.get('name'),
							valid: false,
							visible: true
						}
					]
				}
			)
		);

		setTimeout(function() {
			assert.equal(firstPageField, form.getFirstPageField());

			form.destroy();

			done();
		}, 100);
	});

	it('should call .nextPage(), .prevPage() after clicking on pagination controls', function(done) {
		var A = AUI(),
			test = this,
			container = A.Node.create(test.multiplePageMarkup);

		container.appendTo(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			container: container,
			definition: test.multiplePageDefinition,
			layout: test.multiplePageLayout
		}).render();

		sinon.spy(form, 'nextPage');
		sinon.spy(form, 'prevPage');

		container.one('.lfr-ddm-form-pagination-next').simulate('click');
		container.one('.lfr-ddm-form-pagination-prev').simulate('click');

		assert.isTrue(form.nextPage.calledOnce);
		assert.isTrue(form.prevPage.calledOnce);

		form.destroy();

		done();
	});
});