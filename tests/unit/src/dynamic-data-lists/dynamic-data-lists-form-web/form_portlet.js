'use strict';

var assert = chai.assert;

// Black Magic
var registerAlloyEditor = function(name) {
	var A = AUI();

	if (!window._editorInstances) {
		window._editorInstances = {};
	}

	CKEDITOR.disableAutoInline = true;

	CKEDITOR.env.isCompatible = true;

	var getInitialContent = function() {
		return '';
	};

	var createInstance = function() {
		document.getElementById(name).setAttribute('contenteditable', true);

		var editorConfig = {};

		window._editorInstances[name] = new A.LiferayAlloyEditor(
			{
				editorConfig: {
					srcNode: document.getElementById(name)
				},
				namespace: name,
				plugins: {},
				textMode: true
			}
		).render();
	};

	window[name] = {
		create: function() {
			if (!window._editorInstances[name]) {
				var editorNode = A.Node.create(editor);

				var editorContainer = A.one('#' + name + 'Container');

				editorContainer.appendChild(editorNode);

				window[name].initEditor();
			}
		},

		destroy: function() {
			window[name].dispose();

			window[name] = null;
		},

		dispose: function() {
			if (window._editorInstances[name]) {
				window._editorInstances[name].destroy();

				window._editorInstances[name] = null;
			}

			var editorNode = document.getElementById(name);

			if (editorNode) {
				editorNode.parentNode.removeChild(editorNode);
			}
		},

		focus: function() {
			if (window._editorInstances[name]) {
				window._editorInstances[name].focus();
			}
		},

		getHTML: function() {
			var data = '';

			if (window._editorInstances[name] && window._editorInstances[name].instanceReady) {
				data = window._editorInstances[name].getHTML();
			}
			else {
				getInitialContent();
			}

			return data;
		},

		getText: function() {
			var data = '';

			if (window._editorInstances[name] && window._editorInstances[name].instanceReady) {
				data = window._editorInstances[name].getText();
			}
			else {
				data = getInitialContent();
			}

			return data;
		},

		initEditor: function() {
			createInstance();
		},

		setHTML: function(value) {
			if (window._editorInstances[name]) {
				window._editorInstances[name].setHTML(value);
			}
		}
	};

	window[name].initEditor();

	return window[name];
};

var getTestData = function(callback) {
	$.when(
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/field_types.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_definition.json'),
		$.get('/base/src/dynamic-data-mapping/dynamic-data-mapping-form-renderer/assets/markup_with_repeatable_layout.json')
	).done(callback);
};

describe('DDL Form Portlet', function() {
	this.timeout(120000);

	before(function(done) {
		var test = this;

		Liferay.Language.get = sinon.stub().returnsArg(0);

		AUI().use(
			'liferay-alloy-editor',
			'liferay-form',
			'liferay-ddl-portlet',
			'liferay-ddm-form-renderer-field-types',
			function(A) {
				getTestData(function(fieldTypes, definition, layout) {
					test.definition = definition[0];
					test.layout = layout[0];

					Liferay.DDM.Renderer.FieldTypes.register(fieldTypes[0]);

					done();
				});
			}
		);
	});

	beforeEach(function() {
		document.body.innerHTML = '<div id="_namespace_loader"></div>';
	});

	it('should create a Form Builder with fields defined in "definition" and "layout"', function(done) {
		var test = this,
			A = AUI();

		var portlet = new Liferay.DDL.Portlet(
			{
				definition: test.definition,
				editForm: A.Node.create('<form />'),
				layout: test.layout,
				namespace: '_namespace_'
			}
		);

		var formBuilder = portlet.get('formBuilder');

		assert.equal(portlet.get('definition'), formBuilder.get('definition'));
		assert.equal(portlet.get('layout').pages, formBuilder.get('pagesJSON'));

		portlet.destroy();

		done();
	});

	it('should serialize the Form Builder into a definition and layout uppon submit', function(done) {
		var test = this,
			A = AUI();

		var definitionInput = A.Node.create('<input name="_namespace_definition" id="_namespace_definition" type="hidden" />');
		var descriptionEditorNode = A.Node.create('<div id="_namespace_descriptionEditorContainer"><div class="alloy-editor alloy-editor-placeholder" contenteditable="false" id="_namespace_descriptionEditor" name="_namespace_descriptionEditor"></div></div>');
		var descriptionInput = A.Node.create('<input name="_namespace_description" id="_namespace_description" type="hidden" />');
		var formNode = A.Node.create('<form action="" name="_namespace_testForm" id="_namespace_testForm"></form>');
		var layoutInput = A.Node.create('<input name="_namespace_layout" id="_namespace_layout" type="hidden" />');
		var nameEditorNode = A.Node.create('<div id="_namespace_nameEditorContainer"><div class="alloy-editor alloy-editor-placeholder" contenteditable="false" id="_namespace_nameEditor" name="_namespace_nameEditor"></div></div>');
		var nameInput = A.Node.create('<input name="_namespace_name" id="_namespace_name" type="hidden" />');
		var submitButton = A.Node.create('<button id="_namespace_submit" type="submit" />');

		formNode.append(nameEditorNode);
		formNode.append(nameInput);
		formNode.append(descriptionEditorNode);
		formNode.append(descriptionInput);
		formNode.append(definitionInput);
		formNode.append(layoutInput);
		formNode.append(submitButton);
		formNode.appendTo(document.body);

		// Liferay needded this
		// document['_namespace_testForm'] = formNode.getDOM();

		var descriptionEditor = registerAlloyEditor('_namespace_descriptionEditor');
		var nameEditor = registerAlloyEditor('_namespace_nameEditor');

		Liferay.Form.register({
			id: '_namespace_testForm'
		});

		var portlet = new Liferay.DDL.Portlet(
			{
				definition: test.definition,
				editForm: Liferay.Form.get('_namespace_testForm'),
				layout: test.layout,
				namespace: '_namespace_'
			}
		);

		formNode.simulate('submit');

		// Since the order of the fields is not important in the
		// definition, le't look the the definition contais all
		// field names

		var expectedFields = test.definition.fields;
		var expectedFieldNames = _.map(expectedFields, function(expectedField) {
			return expectedField.name;
		});

		var actualFields = JSON.parse(definitionInput.val()).fields;
		var actualFieldNames = _.map(actualFields, function(actualField) {
			return actualField.name;
		});

		assert.sameMembers(actualFieldNames, expectedFieldNames);

		// TODO - Destroying causes errors
		// descriptionEditor.destroy();
		// nameEditor.destroy();

		portlet.destroy();

		done();
	});

	it('should destroy the formBuilder after the event "destroyPortlet" is fired', function(done) {
		var test = this,
			A = AUI();

		var portlet = new Liferay.DDL.Portlet(
			{
				definition: test.definition,
				editForm: A.Node.create('<form />'),
				layout: test.layout,
				namespace: '_namespace_'
			}
		);

		var formBuilder = portlet.get('formBuilder');

		sinon.spy(formBuilder, 'destroy');

		Liferay.fire('destroyPortlet');

		assert.isTrue(formBuilder.destroy.calledOnce);

		formBuilder.destroy.restore();

		done();
	});
});