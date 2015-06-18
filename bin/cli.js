#!/usr/bin/env node

var rc = require('rc');
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

var yargs = require('yargs')
	.string('_')
	.usage('forms [command] [options]')
	.alias('v', 'version')
	.describe('version', 'Prints current version')
	.help('h')
	.epilog('Copyright 2015')
	.version(function() {
		return require('../package').version;
	});

require('../gulpfile');

for (var task in gulp.tasks) {
	yargs.command(task, 'Gulp task');
}

var argv = yargs.argv;

if (!argv._.length) {
	console.log(yargs.help());;

	process.exit(0)
}

function home() {
	return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var configFile = path.resolve(home(), 'forms.config.js');

try {
	fs.lstatSync(configFile);

	GLOBAL._formsConfig = require(configFile);

	gulp.start.apply(gulp, argv._);
}
catch (e) {
	console.error(e);
	console.log('No config file found:', configFile);

	process.exit(1);
}