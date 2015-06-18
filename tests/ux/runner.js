/**
 * wrapper arround mocha cmd
 * figures out options and calls mocha with desired arguments
 */

var spawn = require('child_process').spawn,
	path = require('path'),
	args = [path.join(__dirname, '..', '..', 'node_modules', '.bin', '_mocha')],
	config = require('./config').config;

module.exports = function() {
	/**
	 * execute init script with mocha
	 * init script handles the rest
	 */
	args.push(path.join(__dirname, 'support', 'init.js'));

	var proc = spawn(process.argv[0], args, {
		stdio: [0, 1, 2]
	});

	proc.on('exit', function(code, signal) {
		process.on('exit', function() {
			if (signal) {
				process.kill(process.pid, signal);
			} else {
				process.exit(code);
			}
		});
	});
}