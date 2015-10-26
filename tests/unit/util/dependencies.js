'use strict';

var path = require('path');

var config = require('../../../config');
var osgi = require('./osgi.js');
var properties = require('./properties.js');

var liferaySourceDir = config.liferaySourceDir;

var mocksDir = path.join('mocks');

var soyDir = path.join(liferaySourceDir, 'modules', 'frontend', 'frontend-js-soyutils-web');
var soyJSDir = path.join(osgi.resourcesMainPath(soyDir));

var frontendDir = path.join(liferaySourceDir, 'modules', 'frontend', 'frontend-js-web');
var frontendJsSrcDir = path.join(osgi.resourcesMainPath(frontendDir));
var frontendTmpSrcDir = path.join(frontendDir, 'tmp', 'META-INF', 'resources');

var editorsDir = path.join(liferaySourceDir, 'modules', 'frontend', 'frontend-editors-web');
var editorsTmpSrcDir = path.join(editorsDir, 'tmp', 'META-INF', 'resources');

// DMD Renderer
var ddmRendererResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-form-renderer');

// DDM Fields
var checkboxResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-checkbox');
var optionsResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-options');
var radioResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-radio');
var selectResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-select');
var textResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-text');
var validationResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-validation');

// DMD Web
var ddmWebResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-web');

// DDL Forms Portlet
var ddlFormsResourcesDir = osgi.ddlBundleResourcesPath('dynamic-data-lists-form-web');

var files = [
	mocksDir + '/liferay.js'
];

module.exports = function(callback) {
	properties.read(
		path.resolve(liferaySourceDir, 'portal-impl/src/portal.properties'),
		function(data) {
			var props = data[0];

			var bareboneFiles = props['javascript.barebone.files'].split(',');

			bareboneFiles.forEach(
				function(file) {
					var filePath = [file];

					if ((file.indexOf('aui') === 0) ||
						(file.indexOf('bootstrap') === 0) ||
						(file.indexOf('lexicon') === 0) ||
						(file.indexOf('loader.js') > -1)) {

						filePath.unshift(frontendTmpSrcDir);
					}
					else {
						filePath.unshift(frontendJsSrcDir);
					}

					files.push(
						{
							included: true,
							pattern: filePath.join('/'),
							served: true
						}
					);

					if (file === 'liferay/modules.js') {
						files.push(mocksDir + '/modules.js');
					}

					if (file === 'liferay/util.js') {
						files.push(mocksDir + '/util.js');
					}
				}
			);

			callback(
				files.concat(
					[
						{
							included: false,
							pattern: mocksDir + '/*.js',
							served: true
						},
						{
							included: false,
							pattern: frontendTmpSrcDir + '/aui/**/*.css',
							served: true
						},
						{
							included: false,
							pattern: frontendTmpSrcDir + '/aui/**/*.js',
							served: true
						},
						{
							included: true,
							pattern: editorsTmpSrcDir + '/**/*.css',
							served: true
						},
						{
							included: true,
							pattern: editorsTmpSrcDir + '/alloyeditor/ckeditor.js',
							served: true
						},
						{
							included: false,
							pattern: editorsTmpSrcDir + '/alloyeditor/config.js',
							served: true
						},
						{
							included: false,
							pattern: editorsTmpSrcDir + '/alloyeditor/lang/en.js',
							served: true
						},
						{
							included: false,
							pattern: editorsTmpSrcDir + '/alloyeditor/styles.js',
							served: true
						},
						{
							included: true,
							pattern: editorsTmpSrcDir + '/alloyeditor/liferay-alloy-editor-no-ckeditor-min.js',
							served: true
						},
						{
							included: true,
							pattern: soyJSDir + '/config.js',
							served: true
						},
						{
							included: true,
							pattern: soyDir + '/classes/META-INF/resources/soyutils.js',
							served: true
						},
						{
							included: true,
							pattern: frontendJsSrcDir + '/**/*.js',
							served: true
						},
						{
							included: true,
							pattern: ddmRendererResourcesDir + '/js/*.js',
							served: true
						},
						{
							included: true,
							pattern: ddmRendererResourcesDir + '/*.js',
							served: true
						},
						{
							included: true,
							pattern: ddmWebResourcesDir + '/js/*.js',
							served: true
						},
						{
							included: true,
							pattern: ddlFormsResourcesDir + '/admin/js/*.js',
							served: true
						},
						{
							included: true,
							pattern: checkboxResourcesDir + '/*.js',
							served: true
						},
						{
							included: true,
							pattern: selectResourcesDir + '/*.js',
							served: true
						},
						{
							included: true,
							pattern: optionsResourcesDir + '/*.js',
							served: true
						},
						{
							included: true,
							pattern: textResourcesDir + '/*.js',
							served: true
						},
						{
							included: true,
							pattern: radioResourcesDir + '/*.js',
							served: true
						},
						{
							included: true,
							pattern: validationResourcesDir + '/*.js',
							served: true
						},
						{
							included: true,
							pattern: validationResourcesDir + '/*.css',
							served: true
						},
						{
							included: true,
							pattern: ddmRendererResourcesDir + '/css/*.css',
							served: true
						}
					]
				)
			);
		}
	);
};