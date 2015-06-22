'use strict';

var gulp = require('gulp');
var selenium = require('selenium-standalone');
var runSequence = require('run-sequence');
var fs = require('fs');

var runner = require('../tests/ux/runner');
var tomcat = require('./lib/tomcat');
var kill = require('./lib/kill');

var seleniumProcess;

module.exports = function() {
	gulp.task('test:ux', ['test:ux:start-tomcat', 'test:ux:start-selenium'], function(done) {
		runner({ sauceLabs: false }, function() {
			runSequence('test:ux:stop-tomcat', 'test:ux:stop-selenium', done);
		});
	});

	gulp.task('test:ux:debug', ['test:ux:start-selenium'], function(done) {
		runner({ sauceLabs: false }, function() {
			runSequence('test:ux:stop-selenium', done);
		});
	});

	gulp.task('test:ux:saucelabs', ['test:ux:start-tomcat', 'test:ux:start-selenium'], function(done) {
		runner({ sauceLabs: true }, function() {
			runSequence('test:ux:stop-tomcat', 'test:ux:stop-selenium', done);
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
		var out = fs.openSync('./selenium.out', 'a');

		selenium.start({
			spawnOptions: {
				detached: true,
				stdio: ['ignore', out, out]
			}
		}, function(err, child) {
			seleniumProcess = child;

			var shutDown = function() {
				kill(seleniumProcess.pid);
			};

			process.on('exit', shutDown);
			process.on('SIGTERM', shutDown);

			done();
		});
	});

	gulp.task('test:ux:stop-selenium', [], function(done) {
		if (seleniumProcess) {
			seleniumProcess.kill();
			kill(seleniumProcess.pid);
		}

		done();
	});

	gulp.task('test:ux:start-tomcat', ['test:ux:stop-tomcat'], function(done) {
		tomcat.start(done);
	});

	gulp.task('test:ux:stop-tomcat', [], function(done) {
		tomcat.stop(done);
	});
};