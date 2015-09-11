'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Field Events Support', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'node-event-simulate',
			'liferay-ddm-form-renderer-field',
			'liferay-ddm-form-renderer-field-repetition',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should fire the "valueChanged" event when input node changes', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text'
		}).render();

		var callback = sinon.spy();

		field.on('valueChanged', callback);

		field.getInputNode().simulate('change');

		assert.isTrue(callback.calledOnce);

		field.destroy();

		done();
	});

	it('should still fire the "valueChanged" event when container changes', function(done) {
		var A = AUI(),
			field = new Liferay.DDM.Renderer.Field({
				type: 'text'
			}).render();

		var callback = sinon.spy();

		field.on('valueChanged', callback);

		field.set('container', A.Node.create('<div></div>'));

		field.render();

		field.get('container').appendTo(document.body);

		field.getInputNode().simulate('change');

		assert.isTrue(callback.calledOnce);

		field.destroy();

		done();
	});
});