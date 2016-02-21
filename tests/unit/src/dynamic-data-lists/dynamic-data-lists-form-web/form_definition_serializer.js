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

		formBuilder.render();

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
							"dataType": "string",
							"fieldNamespace": "",
							"indexType": "keyword",
							"label": {
								"en_US":"First Name"
							},
							"localizable":true,
							"name":"first_name",
							"readOnly": false,
							"repeatable": false,
							"required":true,
							"showLabel":true,
							"tip": "",
							"type":"text",
							"visibilityExpression": ""
						},
						{
							"dataType":"string",
							"fieldNamespace": "",
							"indexType": "keyword",
							"label": {
								"en_US":"Last Name"
							},
							"localizable":true,
							"name":"last_name",
							"predefinedValue": {
								"en_US":""
							},
							"readOnly": false,
							"repeatable": false,
							"required":true,
							"showLabel":true,
							"tip": "",
							"type":"text",
							"visibilityExpression": ""
						},
						{
							"predefinedValue": {
								"en_US":""
							},
							"dataType":"string",
							"showLabel":true,
							"indexType": "keyword",
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
							"tip": "",
							"visibilityExpression": "",
							"readOnly": false,
							"fieldNamespace": "",
							"repeatable": false
						},
						{
							"dataType":"string",
							"fieldNamespace": "",
							"indexType": "keyword",
							"label": {
								"en_US":"Favourite Color"
							},
							"localizable":true,
							"multiple": false,
							"name":"color",
							"options": [
								{ label: { en_US: 'Blue' }, value: 'blue' },
								{ label: { en_US: 'Red' }, value: 'red' },
								{ label: { en_US: 'Green' }, value: 'green' }
							],
							"predefinedValue": {
								"en_US":""
							},
							"readOnly": false,
							"repeatable": false,
							"required":false,
							"showLabel":true,
							"tip": "",
							"type":"select",
							"visibilityExpression": ""
						},
						{
							"dataType":"boolean",
							"fieldNamespace": "",
							"indexType": "keyword",
							"label": {
								"en_US":"I Agree to the terms"
							},
							"localizable": true,
							"name":"agree",
							"predefinedValue": true,
							"readOnly": false,
							"repeatable": false,
							"required":false,
							"showLabel":true,
							"tip": "",
							"type":"checkbox",
							"visibilityExpression": ""
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