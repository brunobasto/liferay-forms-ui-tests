'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var merge = require('merge');
var openFile = require('open');
var path = require('path');

module.exports = function() {
	gulp.task('test:unit', [], function(done) {
		runKarma({}, function() {
			done();
		});
	});

	gulp.task('test:coverage', [], function(done) {
		runKarma({configFile: path.resolve('tests/unit/karma-coverage.conf.js')}, function() {
			done();
		});
	});

	gulp.task('test:coverage:open', ['test:coverage'], function(done) {
		openFile(path.resolve('tests/unit/coverage/lcov/lcov-report/index.html'));
		done();
	});

	gulp.task('test:browsers', [], function(done) {
		runKarma({
			browsers: ['Chrome', 'Firefox', 'Safari', 'IE9 - Win7', 'IE10 - Win7', 'IE11 - Win7']
		}, done);
	});

	gulp.task('test:saucelabs', [], function(done) {
		var launchers = {
			sl_chrome: {
				base: 'SauceLabs',
				browserName: 'chrome'
			},
			sl_safari: {
				base: 'SauceLabs',
				browserName: 'safari'
			},
			sl_firefox: {
				base: 'SauceLabs',
				browserName: 'firefox'
			},
			sl_ie_9: {
				base: 'SauceLabs',
				browserName: 'internet explorer',
				platform: 'Windows 7',
				version: '9'
			},
			sl_ie_10: {
				base: 'SauceLabs',
				browserName: 'internet explorer',
				platform: 'Windows 7',
				version: '10'
			},
			sl_ie_11: {
				base: 'SauceLabs',
				browserName: 'internet explorer',
				platform: 'Windows 8.1',
				version: '11'
			},
			sl_iphone: {
				base: 'SauceLabs',
				browserName: 'iphone',
				platform: 'OS X 10.10',
				version: '7.1'
			},
			sl_android_4: {
				base: 'SauceLabs',
				browserName: 'android',
				platform: 'Linux',
				version: '4.4'
			},
			sl_android_5: {
				base: 'SauceLabs',
				browserName: 'android',
				platform: 'Linux',
				version: '5.0'
			}
		};

		runKarma({
			browsers: Object.keys(launchers),

			browserDisconnectTimeout: 10000,
			browserDisconnectTolerance: 2,
			browserNoActivityTimeout: 240000,

			captureTimeout: 240000,
			customLaunchers: launchers,

			reporters: ['coverage', 'progress', 'saucelabs'],

			sauceLabs: {
				testName: 'Liferay Forms tests',
				recordScreenshots: false,
				startConnect: true,
				connectOptions: {
					port: 5757,
					logfile: 'sauce_connect.log'
				}
			}
		}, done);
	});

	gulp.task('test:watch', [], function(done) {
		runKarma({
			singleRun: false
		}, done);
	});
};

// Private helpers
// ===============

function runKarma(config, done) {
	config = merge({
		configFile: path.resolve('tests/unit/karma.conf.js'),
		singleRun: true
	}, config);
	karma.start(config, done);
}