'use strict';

var config = require('../../../config');
var path = require('path');

var liferaySourceDir = config.liferaySourceDir;

var appsDir = path.resolve(liferaySourceDir, 'modules', 'apps');

module.exports = {
	ddlBundlePath: function(bundleName) {
		return path.resolve(appsDir, 'business-productivity', 'dynamic-data-lists', bundleName);
	},

	ddlBundleResourcesPath: function(bundleName) {
		return path.resolve(this.resourcesPath(this.ddlBundlePath(bundleName)));
	},

	ddmBundlePath: function(bundleName) {
		return path.resolve(appsDir, 'business-productivity', 'dynamic-data-mapping', bundleName);
	},

	ddmBundleResourcesPath: function(bundleName) {
		return path.resolve(this.resourcesPath(this.ddmBundlePath(bundleName)));
	},

	resourcesMainPath: function(bundleDir) {
		return path.resolve(bundleDir, 'src', 'main', 'resources', 'META-INF', 'resources');
	},

	resourcesPath: function(bundleDir) {
		return path.resolve(bundleDir, 'src', 'main', 'resources', 'META-INF', 'resources');
	}
};