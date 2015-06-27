var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var BeforeEachHook = module.exports = function(done) {
	chai.use(chaiAsPromised);
	chai.should();
	chaiAsPromised.transferPromiseness = this.browser.transferPromiseness;

    done();
};