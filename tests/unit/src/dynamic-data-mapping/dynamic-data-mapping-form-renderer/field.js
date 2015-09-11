'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDM Renderer Field', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-renderer-field',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	var assertAttributeTypes = function(field) {
		assert.isBoolean(field.get('localizable'), 'Attribute "localizable" should always be a boolean.');
		assert.isString(field.get('visibilityExpression'), 'Attribute "visibilityExpression" should always be a string.');
		assert.isString(field.get('name'), 'Attribute "name" should always be a string.');
	};

	it('should instantiate a new field with a basic definition', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			name: 'fieldName',
			localizable: true,
			visibilityExpression: 'false',
			type: 'text'
		});

		assertAttributeTypes(field);

		field.destroy();

		done();
	});

	it('should render a new field without a parent field/form', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text'
		});

		field.render();

		var container = field.get('container');

		var parentContainer = field.get('parent').get('container');

		assert.isTrue(parentContainer.contains(container), 'Container should be in parent\'s container after calling .render()');

		field.destroy();

		done();
	});

	it('should render a new field with a parent field', function(done) {
		var parentField = new Liferay.DDM.Renderer.Field({
			type: 'text',
			name: 'parent'
		});

		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			name: 'child',
			parent: parentField
		});

		var parentContainer = parentField.get('container');

		var container = field.get('container');

		assert.isTrue(parentContainer.contains(container), 'Container should be in parent\'s container after calling .render()');

		field.destroy();
		parentField.destroy();

		done();
	});

	it('should render the value of a localizable field', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			localizable: true,
			type: 'text',
			locale: 'en_US',
			value: {
				en_US: 'Bruno Basto'
			}
		});

		var inputNode = field.getInputNode();

		assert.equal('Bruno Basto', inputNode.val());

		field.destroy();

		done();
	});

	it('should render only string values', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			localizable: true,
			type: 'text',
			locale: 'en_US',
			value: undefined
		});

		var inputNode = field.getInputNode();

		assert.equal('', inputNode.val());

		field.destroy();

		done();
	});

	it('should render the value of a unlocalizable field', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			localizable: false,
			type: 'text',
			locale: 'en_US',
			value: 'Bruno Basto'
		}).render();

		var inputNode = field.getInputNode();

		assert.equal('Bruno Basto', inputNode.val());

		field.destroy();

		done();
	});

	it('should update the rendered value of a localizable field', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			localizable: true,
			type: 'text',
			locale: 'en_US',
			value: {
				en_US: 'Bruno Basto'
			}
		});

		field.set('value', {
			en_US: 'Marcellus'
		});

		var inputNode = field.getInputNode();

		assert.equal('Marcellus', inputNode.val());

		field.destroy();

		done();
	});

	it('should reset the value when the localizable attribute changes', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			localizable: true,
			type: 'text',
			locale: 'en_US',
			value: {
				en_US: 'Bruno Basto'
			}
		});

		field.set('localizable', false);

		field.render();

		var inputNode = field.getInputNode();

		assert.equal('', inputNode.val());

		field.destroy();

		done();
	});

	it('should serialize the value of an unlocalizable field', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			localizable: false
		});

		var value = 'Bruno Basto';

		field.set('value', value);

		var json = field.toJSON();

		assert.property(json, 'name');
		assert.property(json, 'instanceId');
		assert.property(json, 'value');

		assert.equal(value, json.value);

		field.destroy();

		done();
	});

	it('should serialize the value of a localizable field', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			locale: 'en_US',
			localizable: true
		});

		var value = {
			en_US: 'Bruno Basto'
		};

		field.set('value', value);

		var json = field.toJSON();

		assert.property(json, 'name');
		assert.property(json, 'instanceId');
		assert.property(json, 'value');

		assert.isObject(json.value);
		assert.deepEqual(value, json.value);

		field.destroy();

		done();
	});

	it('should serialize the value of a field with the updated value from the DOM', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			value: {
				en_US: 'Bruno Basto'
			}
		});

		field.getInputNode().val('Marcellus');

		var json = field.toJSON();

		assert.property(json, 'value');
		assert.isObject(json.value, 'value');
		assert.property(json.value, field.get('locale'));

		assert.equal(json.value[field.get('locale')], 'Marcellus');

		field.destroy();

		done();
	});

	it('should serialize the value of a localizable field with nested fields', function(done) {
		var child = new Liferay.DDM.Renderer.Field({
			type: 'text'
		}).render();

		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			localizable: true,
			fields: [child]
		}).render();

		var value = {
			en_US: 'Bruno Basto'
		};

		field.set('value', value);

		var json = field.toJSON();

		assert.property(json, 'name');
		assert.property(json, 'instanceId');
		assert.property(json, 'value');
		assert.property(json, 'nestedFieldValues');

		assert.isObject(json.value);
		assert.deepEqual(value, json.value);

		assert.equal(field.get('fields').length, json.nestedFieldValues.length);

		child.destroy();
		field.destroy();

		done();
	});

	it('should always display the field label as a string', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			localizable: true
		});

		var label = field.get('label');

		assert.isString(label, 'Label should always be a string.');

		field.destroy();

		done();
	});

	it('should display the label according to the definition', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			label: 'My Field Label',
			localizable: true
		});

		var labelNode = field.getLabelNode();

		assert.equal(labelNode.text(), field.get('label'), 'Label in DOM should equal actual field label.');

		field.destroy();

		done();
	});

	it('should display a localized label according to the definition', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			label: {
				en_US: 'Label'
			},
			locale: 'en_US',
			localizable: true
		});

		assert.isObject(field.get('label'), 'Label should be an object');

		assert.equal(field.getLabelNode().text(), 'Label', 'Label in DOM should equal actual field label');

		field.destroy();

		done();
	});

	it('should display the name as the label when no label is specified', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text',
			name: 'name',
			localizable: true
		});

		var labelNode = field.getLabelNode();

		assert.equal(labelNode.text(), field.get('name'), 'Label in DOM should equal field name.');

		field.destroy();

		done();
	});

	it('should throw an exception when trying to initialize a field without a specified type', function(done) {
		var createField = function() {
			new Liferay.DDM.Renderer.Field();
		};

		assert.throw(createField, /Unknown field type "\w*"\./ig);

		done();
	});

	it('should remove the field from the DOM after calling .destroy()', function(done) {
		var field = new Liferay.DDM.Renderer.Field({
			type: 'text'
		});

		var parent = field.get('parent');

		var container = field.get('container');

		assert.isTrue(parent.get('container').contains(container), 'Container should be in parent\'s container before destroying.');

		field.destroy();

		assert.isFalse(parent.get('container').contains(container), 'Container should not be in parent\'s container before destroying.');

		done();
	});
});