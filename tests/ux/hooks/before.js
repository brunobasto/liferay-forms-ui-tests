var SauceLabs = require('saucelabs');

var WebdriverIO = require('webdriverio'),
	merge = require('deepmerge'),
	config = require('../support/configure');

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

	if (testConfig.sauceLabs) {
		config.capabilities = merge(config.capabilities, {
			browserName: 'chrome',
			name: 'Liferay Forms - UX',
			platform: 'Windows 7',
			screenResolution: '1600x1200'
		});
	}

	options.desiredCapabilities = config.capabilities;

	var browser = WebdriverIO.remote(options);
	this.browser = browser;

	browser
	.addCommand('sauceJobStatus', function(status, done) {
		var sessionID = browser.requestHandler.sessionID;
		var sauceAccount = new SauceLabs({
			username: process.env.SAUCE_USERNAME,
			password: process.env.SAUCE_ACCESS_KEY
		});

		sauceAccount.updateJob(sessionID, status, done);
	})
	.init().call(done);
};