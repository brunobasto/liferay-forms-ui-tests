'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup.html'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable.html'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_values.json')
	).done(callback);
};

describe('DDM Renderer Form Definition Support', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		AUI().use(
			'liferay-ddm-form-renderer',
			'liferay-ddm-form-renderer-field',
			function(A) {
				getTestData(
					function(fieldTypes, markup, definition, markupWithRepeatable, definitionWithRepeatable, valuesWithRepeatable) {
						test.markup = markup[0];
						test.definition = definition[0];
						test.markupWithRepeatable = markupWithRepeatable[0];
						test.definitionWithRepeatable = definitionWithRepeatable[0];
						test.valuesWithRepeatable = valuesWithRepeatable[0];

						Liferay.DDM.Renderer.FieldTypes.register(fieldTypes[0]);

						done();
					}
				);
			}
		);
	});

	it('should set the fields attribute according to the definition when fields array is empty', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			definition: {
				fields: [
					{
						type: 'text',
						name: 'field01'
					}
				]
			},
			fields: []
		}).render();

		var fields = form.get('fields');

		assert.lengthOf(fields, 1, 'Length of "fields" attribute should be 1');

		done();
	});

	it('should update the fields after the attribute "definition" changes', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			definition: {
				fields: [
					{
						type: 'text',
						name: 'field01'
					}
				]
			}
		}).render();

		assert.lengthOf(form.get('fields'), 1, 'Length of "fields" attribute should be 1');

		form.set('definition', {
			fields: [
				{
					type: 'text',
					name: 'field01'
				},
				{
					type: 'text',
					name: 'field02'
				}
			]
		});

		assert.lengthOf(form.get('fields'), 2, 'Length of "fields" attribute should be 2');

		form.destroy();

		done();
	});

	it('should set the initial field values according to the attribute "values"', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			definition: {
				fields: [
					{
						type: 'text',
						name: 'field01',
						localizable: false
					}
				]
			},
			values: {
				fieldValues: [
					{
						name: 'field01',
						value: 'Bruno'
					}
				]
			}
		}).render();

		var field = form.get('fields')[0];

		assert.ok(field);
		assert.equal(field.getValue(), 'Bruno');

		form.destroy();

		done();
	});

	it('should update field values according to the attribute "values" of the form', function(done) {
		var form = new Liferay.DDM.Renderer.Form({
			definition: {
				fields: [
					{
						type: 'text',
						name: 'name',
						localizable: false
					}
				]
			},
			values: {
				fieldValues: [
					{
						name: 'name',
						instanceId: '012345',
						value: 'Bruno'
					}
				]
			}
		}).render();

		// Initial value is 'Bruno', lets change it and see if it gets updated

		form.set('values', {
			fieldValues: [
				{
					name: 'name',
					instanceId: '012345',
					value: 'Marcellus'
				}
			]
		});

		var field = form.get('fields')[0];

		assert.ok(field);
		assert.equal(field.getValue(), 'Marcellus');

		form.destroy();

		done();
	});

	it('should have fields in DOM with values matching the form "values" attribute', function(done) {
		var test = this,
			A = AUI();

		var form = new Liferay.DDM.Renderer.Form({
			container: A.Node.create(test.markupWithRepeatable),
			definition: test.definitionWithRepeatable,
			values: test.valuesWithRepeatable
		});

		_.each(form.get('fields'), function(field, index) {
			assert.deepEqual(field.get('value'), test.valuesWithRepeatable.fieldValues[index].value);
		});

		form.destroy();

		done();
	});

	it('should retrieve fields already in DOM and don\'t create a new container', function(done) {
		var test = this;

		var A = AUI();

		var container = A.Node.create(test.markupWithRepeatable);

		var form = new Liferay.DDM.Renderer.Form({
			container: container,
			definition: test.definitionWithRepeatable,
			values: test.valuesWithRepeatable
		});

		assert.equal(
			container.all('.lfr-ddm-form-field-container').size(),
			form.get('fields').length
		);

		form.destroy();

		done();
	});

	it('should retrieve fields already in DOM and don\'t create a new container even when values is not passed', function(done) {
		var test = this;

		var A = AUI();

		var container = A.Node.create(test.markup);

		var form = new Liferay.DDM.Renderer.Form({
			container: container,
			definition: test.definition
		}).render();

		assert.equal(
			container.all('.lfr-ddm-form-field-container').size(),
			form.get('fields').length
		);

		form.destroy();

		done();
	});

	it('should set the correct repeatedIndex for fields already in DOM', function(done) {
		var test = this;

		var A = AUI();

		var container = A.Node.create(test.markupWithRepeatable);

		container.appendTo(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			container: container,
			definition: test.definitionWithRepeatable,
			values: test.valuesWithRepeatable
		}).render();

		var fields = form.get('fields');

		// the first field is not repeatable
		fields.shift();

		fields.forEach(function(field, index) {
			assert.equal(field.get('repeatedIndex'), index);
		});

		form.destroy();

		done();
	});

	it('should not change the values of the fields after repeating a field', function(done) {
		var test = this;

		var A = AUI();

		var container = A.Node.create(test.markupWithRepeatable);

		container.appendTo(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			container: container,
			definition: test.definitionWithRepeatable,
			values: test.valuesWithRepeatable
		});

		var fields = form.get('fields');

		var lengthBefore = fields.length;

		var valuesBefore = _.map(
			fields,
			function(field) {
				return field.get('value');
			}
		);

		var repeated = fields[1].repeat();

		assert.lengthOf(form.get('fields'), lengthBefore + 1, 'After repeating, length should increase by 1');

		repeated.remove();

		assert.lengthOf(form.get('fields'), lengthBefore, 'After removing, length should equal');

		var valuesAfter = _.map(
			form.get('fields'),
			function(field) {
				return field.get('value');
			}
		);

		assert.deepEqual(valuesBefore, valuesAfter);

		form.destroy();

		done();
	});
});