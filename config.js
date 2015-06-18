var path = require('path');

var config = {
	liferayBundleDir: path.resolve('../bundles/tomcat-7.0.62'),
	liferaySourceDir: path.resolve('../liferay-portal')
};

if (GLOBAL._formsConfig) {
	config = GLOBAL._formsConfig;
}

module.exports = config;