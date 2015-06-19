#!/usr/bin/env node

var rc = require('rc');
var gulp = require('gulp');
// var gutil = require('gulp-util');

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

try {
	gulp.start.apply(gulp, argv._);
}
catch (e) {
	console.err(e);
}