/**
 * Sets the Viewport size of the browser
 */

 var platforms = {
 	desktop: {
		width: 1224,
		height: 500
	},
	mobile: {
		width: 320,
		height: 500
	}
 }

module.exports = function(platform, done) {
	this.browser.setViewportSize(platforms[platform.toLowerCase()])
	.windowHandleSize(function(err, res) {
		should.not.exist(err);

		done();
	})
};
