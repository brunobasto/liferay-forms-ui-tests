'use strict';

var path = require('path');
var config = require('../config');

var liferaySourceDir = config.liferaySourceDir;

var appsDir = path.resolve(liferaySourceDir, 'modules', 'apps');

module.exports = {
	ddmBundleResourcesPath: function(bundleName) {
		return path.resolve(this.resourcesPath(this.ddmBundlePath(bundleName)));
	},

	ddmBundlePath: function(bundleName) {
		return path.resolve(appsDir, 'dynamic-data-mapping', bundleName);
	},

	resourcesPath: function(bundleDir) {
		return path.resolve(bundleDir, 'src', 'META-INF', 'resources');
	}
};