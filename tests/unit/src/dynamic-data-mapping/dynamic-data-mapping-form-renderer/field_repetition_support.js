'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Field Repetition Support', function() {
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

	it('should set the default value of the repeatable attribute', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text'
		}).render();

		assert.isBoolean(field.get('repeatable'), 'Attribute "repeatable" should be a boolean.');
		assert.equal(field.get('repeatable'), false, 'Default value for attribute "repeatable" is false');

		field.set('repeatable', 'false');

		assert.isBoolean(field.get('repeatable'), 'Attribute "repeatable" should always be a boolean.');

		field.destroy();

		done();
	});

	it('should append buttons for repeating and removing a field on the field container', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text'
		}).render();

		var container = field.get('container');

		assert.ok(container.one('.lfr-ddm-form-field-repeatable-add-button'), 'Add button should be present.');
		assert.ok(container.one('.lfr-ddm-form-field-repeatable-delete-button'), 'Delete button should be present.');

		field.destroy();

		done();
	});

	it('should not append buttons when field is not repetable', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: false,
			type: 'text'
		}).render();

		var container = field.get('container');

		assert.notOk(container.one('.lfr-ddm-form-field-repeatable-add-button'), 'Add button should not be present.');
		assert.notOk(container.one('.lfr-ddm-form-field-repeatable-delete-button'), 'Delete button should not be present.');

		field.destroy();

		done();
	});

	it('should not show the remove button for the first repeatable field', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text'
		}).render(document.body);

		var isVisible = function(node) {
			return !node.hasClass('hide') || node.getStyle('display') !== 'none';
		};

		assert.isFalse(
			isVisible(field.get('container').one('.lfr-ddm-form-field-repeatable-delete-button')),
			'Delete button should not be visible.'
		);

		var repeatedField = field.repeat();

		assert.isTrue(
			isVisible(repeatedField.get('container').one('.lfr-ddm-form-field-repeatable-delete-button')),
			'Delete button should be visible.'
		);

		field.destroy();

		done();
	});

	it('should set the repeatedIndex initial value to 0 when field has no sibling', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text'
		}).render();

		assert.equal(0, field.get('repeatedIndex'));

		field.destroy();

		done();
	});

	it('should set the repeatedIndex incrementally after each repetition', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text'
		}).render(document.body);

		var repetitions = [field];

		for (var i = 0; i < 10; i++) {
			repetitions.push(repetitions[repetitions.length - 1].repeat());
		}

		_.each(repetitions, function(curField, index) {
			assert.equal(index, curField.get('repeatedIndex'), 'Repeated index should be ' + index);
		});

		field.destroy();

		done();
	});

	it('should update siblings repeatedIndex after a repetition is added', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text',
			name: 'repeatableField'
		}).render(document.body);

		var repetitions = [];

		for (var i = 0; i < 5; i++) {
			repetitions.unshift(field.repeat());
		}

		var indexes = _.map(repetitions, function(item) {
			return item.get('repeatedIndex');
		});

		assert.deepEqual([1, 2, 3, 4, 5], indexes);

		assert.equal(0, field.get('repeatedIndex'), 'Original field index should remain the sane');

		field.destroy();

		done();
	});

	it('should have the order of fields in DOM respect the repeatedIndex', function(done) {
		var A = AUI();
		var container = A.Node.create('<div></div>');

		container.appendTo(document.body);

		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text',
			name: 'repeatableField'
		}).render(container);

		var repetitions = [];

		for (var i = 0; i < 5; i++) {
			repetitions.unshift(field.repeat());
		}

		repetitions.unshift(field);

		var parent = field.get('parent');

		parent.get('container').all('.lfr-ddm-form-field-container').each(function(container, index) {
			var qualifiedName = container.one('input').attr('name');

			assert.equal(qualifiedName, repetitions[index].getQualifiedName());
		});

		field.destroy();

		done();
	});

	it('should update siblings repeatedIndex after a repetition is removed', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text'
		}).render(document.body);

		var repetitions = [field];

		for (var i = 0; i < 10; i++) {
			repetitions.push(repetitions[repetitions.length - 1].repeat());
		}

		var indexes = _.map(repetitions, function(item) {
			return item.get('repeatedIndex');
		});

		field.remove();

		var newIndexes = _.map(repetitions, function(item) {
			return item.get('repeatedIndex');
		});

		_.each(newIndexes, function(newIndex, index) {
			if (index > 0) {
				assert.equal(indexes[index] - 1, newIndex, 'Repeated index should be ' + newIndexes[index]);
			}
		});

		field.destroy();

		done();
	});

	it('should update only the siblings with the same name', function(done) {
		var parent = new Liferay.DDM.Renderer.Field({
			type: 'text'
		});

		var repeatableChild = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text',
			name: 'repeatable',
			parent: parent
		}).render();

		var regularChild = new Liferay.DDM.Renderer.Field({
			repeatable: false,
			type: 'text',
			name: 'notRepeatable',
			parent: parent
		}).render();

		parent.render(document.body);

		var repeated = repeatableChild.repeat();

		assert.equal(regularChild.get('repeatedIndex'), 0);

		repeated.remove();

		assert.equal(regularChild.get('repeatedIndex'), 0);

		done();
	});

	it('should call .repeat() after clicking on the + button', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text'
		}).render();

		sinon.spy(field, 'repeat');

		var container = field.get('container');

		container.appendTo(document.body);

		container.one('.lfr-ddm-form-field-repeatable-add-button').simulate('click');

		assert.isTrue(field.repeat.calledOnce, 'Method .repeat() should be called once.');

		field.repeat.restore();

		field.destroy();

		done();
	});

	it('should have repeated fields with the same label as the original field', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			label: { en_US: 'This is my label' },
			name: 'field_name',
			repeatable: true,
			type: 'text'
		}).render(document.body);

		var repeated = field.repeat();

		assert.equal(repeated.getLabelNode().text(), field.getLabelNode().text());

		field.destroy();

		done();
	});

	it('should call .remove() after clicking on the minus (-) button', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text'
		}).render();

		sinon.spy(field, 'remove');

		var container = field.get('container');

		container.appendTo(document.body);

		container.one('.lfr-ddm-form-field-repeatable-delete-button').simulate('click');

		assert.isTrue(field.remove.calledOnce, 'Method .remove() should be called once.');

		field.remove.restore();

		field.destroy();

		done();
	});

	it('should not call .remove() or .repeat() when clicking on a node that is not a repeatable button', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			repeatable: true,
			type: 'text'
		}).render();

		sinon.spy(field, 'remove');
		sinon.spy(field, 'repeat');

		var container = field.get('container');

		container.appendTo(document.body);

		container.simulate('click');

		assert.isFalse(field.remove.called, 'Method .remove() should not be called');
		assert.isFalse(field.repeat.called, 'Method .repeat() should not be called');

		field.remove.restore();
		field.repeat.restore();

		field.destroy();

		done();
	});
});