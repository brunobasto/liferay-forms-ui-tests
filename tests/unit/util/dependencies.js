'use strict';

var path = require('path');

var config = require('../../../config');
var osgi = require('./osgi.js');
var properties = require('./properties.js');

var liferaySourceDir = config.liferaySourceDir;

var mocksDir = path.join('mocks');

var frontendDir = path.join(liferaySourceDir, 'modules', 'frontend', 'frontend-js-web');
var frontendJsSrcDir = path.join(osgi.resourcesPath(frontendDir), 'html', 'js');
var frontendTmpSrcDir = path.join(frontendDir, 'tmp', 'META-INF', 'resources', 'html', 'js');

var ddmRendererResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-form-renderer');
var checkboxResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-checkbox');
var radioResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-radio');
var textResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-text');
var optionsResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-options');
var selectResourcesDir = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-select');

var files = [
	mocksDir + '/liferay.js'
];

module.exports = function(callback) {
	properties.read(
		path.join(liferaySourceDir, 'portal-impl/src/portal.properties'),
		function(data) {
			var props = data[0];

			var bareboneFiles = props['javascript.barebone.files'].split(',');

			bareboneFiles.forEach(
				function(file) {
					var filePath = [file];

					if ((file.indexOf('aui') === 0) || (file.indexOf('bootstrap') === 0)) {
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
				}
			);

			callback(
				files.concat(
					[
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
							pattern: ddmRendererResourcesDir + '/css/*.css',
							served: true
						}
					]
				)
			);
		}
	);
};