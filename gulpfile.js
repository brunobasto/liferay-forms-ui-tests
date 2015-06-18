'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

var registerUXlTestsTasks = require('./tasks/test-ux');
var registerUnitTestsTasks = require('./tasks/test-unit');

registerUXlTestsTasks();
registerUnitTestsTasks();

gulp.task('test', function(done) {
	runSequence('test:unit', 'test:ux', function() {
		done();
	});
});