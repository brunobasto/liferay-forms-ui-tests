'use strict';

var assert = chai.assert;

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json')
	).done(callback);
};

describe('DDL Definition Serializer', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddl-form-builder',
			'liferay-ddl-form-builder-definition-serializer',
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				getTestData(function(fieldTypes) {
					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes);

					done();
				});
			}
		);
	});

	it('should serialize fields into a DDM Form definition', function(done) {
		var A = AUI(),
			FieldTypes = Liferay.DDM.Renderer.FieldTypes,
			formBuilder = new Liferay.DDL.FormBuilder();

		var fields = [
			formBuilder.createField(FieldTypes.get('text')),
			formBuilder.createField(FieldTypes.get('text')),
			formBuilder.createField(FieldTypes.get('radio')),
			formBuilder.createField(FieldTypes.get('select')),
			formBuilder.createField(FieldTypes.get('checkbox'))
		];

		fields[0].set('name', 'first_name');
		fields[0].set('label', { en_US: 'First Name' });
		fields[0].set('required', true);

		fields[1].set('name', 'last_name');
		fields[1].set('label', { en_US: 'Last Name' });
		fields[1].set('required', true);

		fields[2].set('name', 'children');
		fields[2].set('label', { en_US: 'Number of Children' });
		fields[2].set('options', [
			{ label: { en_US: 'One' }, value: '1' },
			{ label: { en_US: 'Two' }, value: '2' },
			{ label: { en_US: 'Three' }, value: '3' }
		]);

		fields[3].set('name', 'color');
		fields[3].set('label', { en_US: 'Favourite Color' });
		fields[3].set('options', [
			{ label: { en_US: 'Blue' }, value: 'blue' },
			{ label: { en_US: 'Red' }, value: 'red' },
			{ label: { en_US: 'Green' }, value: 'green' }
		]);

		fields[4].set('name', 'agree');
		fields[4].set('localizable', false);
		fields[4].set('label', { en_US: 'I Agree to the terms' });
		fields[4].set('predefinedValue', true);

		var pages = [
			new A.Layout({
				rows: [
					new A.LayoutRow({
						cols: [
							new A.LayoutCol({
								size: 6,
								value: new A.FormBuilderFieldList({
									fields: [fields[0]]
								})
							}),
							new A.LayoutCol({
								size: 6,
								value: new A.FormBuilderFieldList({
									fields: [fields[1]]
								})
							})
						]
					}),
					new A.LayoutRow({
						cols: [
							new A.LayoutCol({
								size: 6,
								value: new A.FormBuilderFieldList({
									fields: [fields[2]]
								})
							}),
							new A.LayoutCol({
								size: 6,
								value: new A.FormBuilderFieldList({
									fields: [fields[3]]
								})
							})
						]
					})
				]
			}),
			new A.Layout({
				rows: [
					new A.LayoutRow({
						cols: [
							new A.LayoutCol({
								size: 12,
								value: new A.FormBuilderFieldList({
									fields: [fields[4]]
								})
							})
						]
					})
				]
			})
		];

		var serializer = new Liferay.DDL.DefinitionSerializer({
			builder: formBuilder,
			pages: pages
		});

		try {
			assert.deepEqual(
				JSON.parse(serializer.serialize()),
				{
					"defaultLanguageId":"en_US",
					"availableLanguageIds":["en_US"],
					"fields":[
						{
							"predefinedValue": {
								"en_US":""
							},
							"dataType":"string",
							"showLabel":true,
							"name":"first_name",
							"localizable":true,
							"label": {
								"en_US":"First Name"
							},
							"required":true,
							"type":"text",
							"tip":{},
							"visibilityExpression": "true",
							"readOnly": false,
							"fieldNamespace": "",
							"repeatable": false
						},
						{
							"predefinedValue": {
								"en_US":""
							},
							"dataType":"string",
							"showLabel":true,
							"name":"last_name",
							"localizable":true,
							"label": {
								"en_US":"Last Name"
							},
							"required":true,
							"type":"text",
							"tip":{},
							"visibilityExpression": "true",
							"readOnly": false,
							"fieldNamespace": "",
							"repeatable": false
						},
						{
							"predefinedValue": {
								"en_US":""
							},
							"dataType":"string",
							"showLabel":true,
							"name":"children",
							"localizable":true,
							"label": {
								"en_US":"Number of Children"
							},
							"options": [
								{ label: { en_US: 'One' }, value: '1' },
								{ label: { en_US: 'Two' }, value: '2' },
								{ label: { en_US: 'Three' }, value: '3' }
							],
							"required":false,
							"type":"radio",
							"tip":{},
							"visibilityExpression": "true",
							"readOnly": false,
							"fieldNamespace": "",
							"repeatable": false
						},
						{
							"predefinedValue": {
								"en_US":""
							},
							"dataType":"string",
							"showLabel":true,
							"name":"color",
							"options": [
								{ label: { en_US: 'Blue' }, value: 'blue' },
								{ label: { en_US: 'Red' }, value: 'red' },
								{ label: { en_US: 'Green' }, value: 'green' }
							],
							"localizable":true,
							"label": {
								"en_US":"Favourite Color"
							},
							"required":false,
							"type":"select",
							"tip":{},
							"visibilityExpression": "true",
							"readOnly": false,
							"fieldNamespace": "",
							"repeatable": false
						},
						{
							"predefinedValue": true,
							"dataType":"string",
							"showLabel":true,
							"name":"agree",
							"localizable":false,
							"label": {
								"en_US":"I Agree to the terms"
							},
							"required":false,
							"type":"checkbox",
							"tip":{},
							"visibilityExpression": "true",
							"readOnly": false,
							"fieldNamespace": "",
							"repeatable": false
						}
					]
				}
			);

			formBuilder.destroy();

			done();
		}
		catch(e) {
			e.actual = JSON.stringify(e.actual);
			e.expected = JSON.stringify(e.expected);

			e.message = ['\n\n\tActual:\n\t', e.actual, '\n\tExpected:\n\t', e.expected, '\n'].join('\n');

			done(e);
		}

		done();
	});
});