var path = require('path');

var config = {
	liferayBundleDir: path.resolve('../bundles/tomcat-7.0.62'),
	liferaySourceDir: path.resolve('../liferay-portal')
};

if (process.env.LIFERAY_BUNDLE_HOME) {
	config.liferayBundleDir = process.env.LIFERAY_BUNDLE_HOME;
}

if (process.env.LIFERAY_SOURCE_HOME) {
	config.liferaySourceDir = process.env.LIFERAY_SOURCE_HOME;
}

module.exports = config;