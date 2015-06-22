var Mocha = require('mocha'),
	Q = require('q'),
	config = require('./config').config,
	path = require('path');

module.exports = function(options, done) {
	var browsers = options.browsers;

	var run = function(browser) {
		var deferred = Q.defer();

		// We need to remove it from the cache so
		// that it runs again with the new globals
		delete require.cache[path.join(__dirname, 'support', 'init.js')];

		var mocha = new Mocha(config.mochaOpts || {});

		mocha.addFile(
			path.join(__dirname, 'support', 'init.js')
		);

		global.testConfig = options;
		global.desiredCapabilities = browser;
		global.mocha = mocha.run(deferred.resolve);

		return deferred.promise;
	};

	var failures = 0;

	var next = function () {
		if (browsers.length) {
			run(browsers.shift()).then(function(code) {
				if (code !== 0) {
					++failures;
				}

				next();
			});
		}
		else {
			process.on('exit', function () {
				process.exit(failures);
			});

			done();
		}
	};

	next();
};