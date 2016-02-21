'use strict';

var config = require('../../../config');
var osgi = require('./osgi.js');
var path = require('path');

var liferaySourceDir = path.resolve(config.liferaySourceDir);

module.exports = {
	normalizeContent: function(file, content) {
		// Normalize OSGI Web-ContextPath for fields

		if (/dynamic-data-mapping-type-([\-\w]+)?/.test(file.path)) {
			var fieldPath = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-$1');

			fieldPath = fieldPath.replace(liferaySourceDir, '/liferay');

			content = content.replace('Liferay.ThemeDisplay.getPathContext()', '\'\'');

			content = content.replace(/\/o\/dynamic-data-mapping-type-([-\w]+)?/g, fieldPath);
		}
		else if (/dynamic-data-mapping-form-renderer/.test(file.path)) {
			var modulePath = osgi.ddmBundleResourcesPath('dynamic-data-mapping-form-renderer');

			modulePath = modulePath.replace(liferaySourceDir, '/liferay');

			content = content.replace('Liferay.ThemeDisplay.getPathContext()', '\'\'');

			content = content.replace(/\/o\/dynamic-data-mapping-form-renderer/g, modulePath);
		}
		else if (/dynamic-data-lists-form-web/.test(file.path)) {
			var modulePath = osgi.ddlBundleResourcesPath('dynamic-data-lists-form-web');

			modulePath = modulePath.replace(liferaySourceDir, '/liferay');

			content = content.replace('Liferay.ThemeDisplay.getPathContext()', '\'\'');

			content = content.replace(/\/o\/dynamic-data-lists-form-web/g, modulePath);
		}
		else if (/frontend-js-soyutils-web/.test(file.path)) {
			var soyDir = path.join(liferaySourceDir, 'modules', 'apps', 'platform', 'frontend', 'frontend-js-soyutils-web');
			var modulePath = path.join(soyDir, 'classes', 'META-INF', 'resources');

			modulePath = modulePath.replace(liferaySourceDir, '/liferay');

			content = content.replace('Liferay.ThemeDisplay.getPathContext()', '\'\'');

			content = content.replace(/\/o\/frontend-js-soyutils-web/g, modulePath);
		}

		return content.replace('[%LIFERAY_PATH%]', 'liferay');
	},

	normalizePath: function(filePath) {
		if (filePath.indexOf(liferaySourceDir) === 0) {
			filePath = filePath.replace(liferaySourceDir, '/liferay');
		}

		return filePath;
	}
};