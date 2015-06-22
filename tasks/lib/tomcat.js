var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var Tail = require('tail').Tail;

var config = require('../../config');
var kill = require('./kill');

var catalina = path.resolve(config.liferayBundleDir, 'bin', 'catalina.sh');

var checkCatalina = function() {
	try {
		fs.lstatSync(catalina);
	}
	catch (e) {
		throw new Error('Could not find tomcat executable:', catalina);
	}
};

module.exports = {
	start: function(done) {
		var instance = this;

		checkCatalina();

		var out = fs.openSync('./tomcat.out', 'a');
		var tailOut = new Tail('./tomcat.out');

		var proc = spawn(catalina, ['run'], {
			detached: true,
			stdio: ['ignore', out, out]
		});

		proc.unref();

		var started = false;

		var onLine = function(line) {
			if (!started) {
				console.log(line);
			}

			var regex = /INFO: Server startup in \d+ ms/;

			if (regex.test(line)) {
				started = true;

				tailOut.unwatch();

				done();
			}
		};

		tailOut.on('line', onLine);

		var shutDown = function () {
			tailOut.unwatch();
			kill(proc.pid);
			instance.stop();
		};

		proc.on('exit', function() {
			if (!started) {
				console.log('There was a problem starting Tomcat. ' +
					'Check logs for more details');
			}

			shutDown();
		});

		process.on('exit', shutDown);
		process.on('SIGTERM', shutDown);
	},

	stop: function(done) {
		checkCatalina();

		var out = fs.openSync('./tomcat.out', 'a');

		var proc = spawn(catalina, ['stop', '-force'], {
			stdio: ['ignore', out, out]
		});

		var shutDown = function () {
			kill(proc.pid);
		};

		proc.on('exit', function() {
			console.log('Gracefully shutting down...');

			if (done) {
				done();
			}

			shutDown();
		});

		process.on('exit', shutDown);
		process.on('SIGTERM', shutDown);
	}
};