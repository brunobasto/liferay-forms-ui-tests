'use strict';

var config = require('../../../config');
var osgi = require('./osgi.js');
var path = require('path');

var liferaySourceDir = path.resolve(config.liferaySourceDir);

var fieldTypeRegex = /.*\/dynamic-data-mapping-type-(\w+)\/.*/ig;

module.exports = {
	normalizeContent: function(content) {
		// Normalize OSGI Web-ContextPath for fields
		if (/\/o\/ddm-type-(\w+)?/.test(content)) {
			var fieldPath = osgi.ddmBundleResourcesPath('dynamic-data-mapping-type-$1');

			fieldPath = fieldPath.replace(liferaySourceDir, '/liferay')

			content = content.replace(/\/o\/ddm-type-(\w+)?/g, fieldPath);
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