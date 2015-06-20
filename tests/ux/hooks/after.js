var AfterHook = module.exports = function(done) {
	if (testConfig.sauceLabs) {
			this.browser.sauceJobStatus({
			passed: mocha.stats.failures === 0,
			'public': true
		});
	}

	this.browser.end(done);
};
