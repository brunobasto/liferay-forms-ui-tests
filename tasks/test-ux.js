'use strict';

var gulp = require('gulp');
var selenium = require('selenium-standalone');

var runner = require('../tests/ux/runner');

module.exports = function() {
	gulp.task('test:ux', ['test:ux:start-selenium'], function(done) {
		runner(function() {
			done();
		});
	});

	gulp.task('test:ux:install-selenium', [], function(done) {
		selenium.install({
			version: '2.45.0',
			baseURL: 'http://selenium-release.storage.googleapis.com',
			drivers: {
				version: '2.15',
				arch: process.arch,
				baseURL: 'http://chromedriver.storage.googleapis.com'
			}
		}, done);
	});

	gulp.task('test:ux:start-selenium', ['test:ux:install-selenium'], function(done) {
		selenium.start({}, done);
	});
};