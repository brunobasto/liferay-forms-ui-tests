/**
 * check content for specific element or input field
 */

// Taken from http://solvedstack.com/questions/javascript-ie-detection-why-not-use-simple-conditional-comments
var ie = function() {
	var undef,
		v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');

	while (
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		all[0]
	);

	return v > 4 ? v : undef;
};

module.exports = function(browser, done) {
	browser.execute('return (' + ie.toString() + ')();', function(err, res) {
		done(err, res.value);
	});
};