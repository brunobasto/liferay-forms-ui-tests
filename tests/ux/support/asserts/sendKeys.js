var waitFor = require('./waitFor');

module.exports = function(string, done) {
	var instance = this;

	instance.browser.keys(string).call(done);
};