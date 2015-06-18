'use strict';

var gulp = require('gulp');

var runner = require('../tests/ux/runner');

module.exports = function() {
	gulp.task('test:ux', [], function(done) {
		runner();
	});

	gulp.task('test:ux', [], function(done) {
		runner();
	});
};