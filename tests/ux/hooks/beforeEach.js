var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var BeforeEachHook = module.exports = function(done) {
	chai.use(chaiAsPromised);
	chai.should();
	chaiAsPromised.transferPromiseness = this.browser.transferPromiseness;

	if (testConfig.sauceLabs) {
		done();
	}
	else {
		this.browser.setViewportSize({
			width: 1280,
			height: 1024
		})
		.windowHandleSize(function(err, res) {
			done();
		});
	}
};