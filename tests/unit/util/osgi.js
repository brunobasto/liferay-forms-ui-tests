'use strict';

var path = require('path');
var config = require('../../../config');

var liferaySourceDir = config.liferaySourceDir;

var appsDir = path.resolve(liferaySourceDir, 'modules', 'apps');

module.exports = {
	ddlBundlePath: function(bundleName) {
		return path.resolve(appsDir, 'dynamic-data-lists', bundleName);
	},

	ddlBundleResourcesPath: function(bundleName) {
		return path.resolve(this.resourcesPath(this.ddlBundlePath(bundleName)));
	},

	ddmBundleResourcesPath: function(bundleName) {
		return path.resolve(this.resourcesPath(this.ddmBundlePath(bundleName)));
	},

	ddmBundlePath: function(bundleName) {
		return path.resolve(appsDir, 'dynamic-data-mapping', bundleName);
	},

	resourcesMainPath: function(bundleDir) {
		return path.resolve(bundleDir, 'src', 'main', 'resources', 'META-INF', 'resources');
	},

	resourcesPath: function(bundleDir) {
		return path.resolve(bundleDir, 'src', 'META-INF', 'resources');
	}
};