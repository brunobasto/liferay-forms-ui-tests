var Mocha = require('mocha'),
	config = require('./config').config,
    path = require('path');

module.exports = function(options, done) {
	var mocha = new Mocha(config.mochaOpts || {});

	mocha.addFile(
		path.join(__dirname, 'support', 'init.js')
	);

	global.testConfig = options;

	global.mocha = mocha.run(function(failures){
		process.on('exit', function () {
			process.exit(failures);
		});

		done();
	});
};