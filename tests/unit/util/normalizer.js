'use strict';

var config = require('../../../config');
var osgi = require('./osgi.js');
var path = require('path');

var liferaySourceDir = path.resolve(config.liferaySourceDir);

module.exports = {
	normalizeContent: function(file, content) {
		// Normalize OSGI Web-ContextPath for fields

		if (/dynamic-data-mapping-type-(\w+)?/.test(file.path)) {
			var fieldPath = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-$1');

			fieldPath = fieldPath.replace(liferaySourceDir, '/liferay');

			content = content.replace('Liferay.ThemeDisplay.getPathContext()', '\'\'');

			content = content.replace(/\/o\/ddm-type-(\w+)?/g, fieldPath);
		}
		else if (/dynamic-data-mapping-form-renderer/.test(file.path)) {
			var modulePath = osgi.ddmBundleResourcesPath('dynamic-data-mapping-form-renderer');

			modulePath = modulePath.replace(liferaySourceDir, '/liferay');

			content = content.replace('Liferay.ThemeDisplay.getPathContext()', '\'\'');

			content = content.replace(/\/o\/ddm-form-renderer/g, modulePath);
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