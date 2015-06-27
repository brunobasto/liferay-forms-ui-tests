var SauceLabs = require('saucelabs');

var WebdriverIO = require('webdriverio'),
	merge = require('deepmerge'),
	config = require('../config');

var BeforeHook = module.exports = function(done) {
	var options = config.options;

	if (testConfig.sauceLabs) {
		config.selenium = merge(config.selenium, {
			host: 'ondemand.saucelabs.com',
			port: 80,
			user: process.env.SAUCE_USERNAME,
			key: process.env.SAUCE_ACCESS_KEY,
			recordScreenshots: true
		});
	}

	options = merge(config.options, config.selenium || {});

	options.desiredCapabilities = desiredCapabilities;

	var browser = this.browser = WebdriverIO.remote(options);

	browser.addCommand('sauceJobStatus', function(status, done) {
		var sessionID = browser.requestHandler.sessionID;
		var sauceAccount = new SauceLabs({
			username: process.env.SAUCE_USERNAME,
			password: process.env.SAUCE_ACCESS_KEY
		});

		sauceAccount.updateJob(sessionID, status, done);
	}).init().call(done);
};