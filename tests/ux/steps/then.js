/**
 * then steps
 */

module.exports = function(dict) {
	this.then(/^I expect that the title is( not)* "$string"$/,
			require('../support/asserts/checkTitle'))

		.then(/^I expect that element "$string" is( not)* visible$/,
			require('../support/asserts/isVisible'))

		.then(/^I expect that element "$string" does( not)* exist$/,
			require('../support/asserts/isExisting'))

		.then(/^I expect that element "$string" does( not)* contain the same text as element "$string"$/,
			require('../support/asserts/compareText'))

		.then(/^I expect that (element|inputfield) "$string"( not)* contains the text "([^"]*)"$/,
			require('../support/asserts/checkContent'))

		.then(/^I expect that the url is( not)* "$string"$/,
			require('../support/asserts/checkURL'))

		.then(/^I expect that the( css)* attribute "$string" from element "$string" is( not)* "$string"$/,
			require('../support/asserts/checkProperty'))

		.then(/^I expect that checkbox "$string" is( not)* selected$/,
			require('../support/asserts/checkSelected'))

		.then(/^I expect that element "$string" is( not)* \d+px (broad|tall)$/,
			require('../support/asserts/checkDimension'));
};