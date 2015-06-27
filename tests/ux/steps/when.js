/**
 * when steps
 */

module.exports = function() {
	this.when(/^I (click|doubleclick) on the (link|button|element) "$string"$/, require('../support/asserts/waitAndClick'))

		.when(/^I (add|set) "$string" to the inputfield "$string"$/, function(method, text, element, done) {
			var command = method === 'add' ? 'addValue' : 'setValue';
			this.browser[command](element, text).call(done);
		})

		.when(/^I clear the inputfield "$string"$/, function(element, done) {
			this.browser.clearElement(element).call(done);
		})

		.when(/^I drag element "$string" to element "$string"$/, function(source, destination, done) {
			this.browser.dragAndDrop(source, destination, this.noError).call(done);
		})

		.when(/^I submit the form "$string"$/, function(form, done) {
			this.browser.submitForm(form).call(done);
		})

		.when(/^I wait on element "$string"\s*(for (\d+)ms)?\s*(to be $string)?$/, function() {
            var waitFor = require('../support/asserts/waitFor');

            waitFor.call(this, arguments[0], arguments[2], arguments[4], arguments[5]);
        })

		.when(/^I pause for (\d+)ms$/, function(ms, done) {
			this.browser.pause(ms).call(done);
		})

		.when(/^I set a cookie "$string" with the content "$string"$/, function(name, content, done) {
			this.browser.setCookie({
				name: name,
				value: content
			}).call(done);
		})

		.when(/^I delete the cookie "$string"$/, function(name, done) {
			this.browser.deleteCookie(name).call(done);
		})

		/**
		 * ToDo add tests
		 */
		.when(/^I press "$string"$/, require('../support/asserts/sendKeys'))

		.when(/^I (accept|dismiss) the alertbox$/, function(action, done) {
			var command = 'alert' + action.slice(0, 1).toUpperCase() + action.slice(1);
			this.browser[command]().call(done);
		});
};