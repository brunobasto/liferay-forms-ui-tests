/**
 * given steps
 */

module.exports = function() {

    this
        .given(/I open the (url|site) "$string"$/, function (type, page, done) {
            var url = type === 'url' ? page : this.baseUrl + page;

            this.browser.url(url , done);
        })
        .given(/^the element "$string" is( not)* visible$/,
            require('../support/asserts/isVisible.js'))

        .given(/^there is (an|no) element "$string" on the page$/,
            require('../support/asserts/checkElementExists.js'))

        .given(/^the title is( not)* "$string"$/,
            require('../support/asserts/checkTitle'))

        .given(/^the element "$string" contains( not)* the same text as element "$string"$/,
            require('../support/asserts/compareText'))

        .given(/^the (element|inputfield) "$string" does( not)* contain the text "([^"]*)"$/,
            require('../support/asserts/checkContent'))

        .given(/^the page url is( not)* "$string"$/,
            require('../support/asserts/checkURL'))

        .given(/^the( css)* attribute "$string" from element "$string" is( not)* "$string"$/,
            require('../support/asserts/checkProperty'))

        .given(/^the checkbox "$string" is( not)* selected$/,
            require('../support/asserts/checkSelected'))

        .given(/^the cookie "$string" contains( not)* the value "$string"$/,
            require('../support/asserts/checkCookieContent'))

        .given(/^the cookie "$string" does( not)* exist$/,
            require('../support/asserts/checkCookieExists'))

        .given(/^the element "$string" is( not)* \d+px (broad|tall)$/,
            require('../support/asserts/checkDimension'));

}
