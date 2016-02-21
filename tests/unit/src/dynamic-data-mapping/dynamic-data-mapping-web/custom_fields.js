'use strict';

var assert = chai.assert;

var reloadFormBuilderData = function(formBuilder, content) {
	var A = AUI();

	if (!A.Lang.isValue(content)) {
		content = window.formBuilder.getContent();
	}

	content = content.replace(/nestedFields/g, 'fields');

	content = formBuilder.deserializeDefinitionFields(JSON.parse(content));

	formBuilder.set('fields', content);
};

describe('OLD DDM Form Builder', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-portlet-dynamic-data-mapping',
			'liferay-portlet-dynamic-data-mapping-custom-fields',
			function(A) {
				done();
			}
		);
	});

	it('LPS-51684 DDM fields of the same type are saved with the same Field Label', function(done) {
		var A = AUI();

		document.body.id = 'main-content';

		var formBuilder = new Liferay.FormBuilder().render();

		window.formBuilder = formBuilder;

		var availableField = new A.LiferayAvailableField({
			icon: 'icon-fb-text',
			label: 'Text',
			type: 'text'
		});

		// Field 1
		var field01 = formBuilder.createField({
			label: availableField.get('label'),
			localizationMap: availableField.get('localizationMap'),
			type: availableField.get('type')
		});

		formBuilder.addField(field01, 0);

		// Field 2
		var field02 = formBuilder.createField({
			label: availableField.get('label'),
			localizationMap: availableField.get('localizationMap'),
			type: availableField.get('type')
		});

		formBuilder.addField(field02, 1);

		// Changing Labels
		field01.set('label', 'Label 01');
		field02.set('label', 'Label 02');

		reloadFormBuilderData(formBuilder);

		// Making Assertions
		var definition = JSON.parse(formBuilder.getContent());

		assert.notDeepEqual(definition.fields[0].label, definition.fields[1].label);

		document.body.id = '';

		done();
	});
});