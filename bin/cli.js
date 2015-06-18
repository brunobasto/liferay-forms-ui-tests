#!/usr/bin/env node

var optimist = require('optimist');
var rc = require('rc');
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

var argv = rc(
	'forms-tests', {}, optimist
	.usage('Usage: $0 [options]')
	.alias('v', 'version').describe('version', 'Prints current version.').boolean('boolean')
	.argv);

if (argv.version) {
	console.error(require('../package').version)
	process.exit(0)
}

function getUserHome() {
	return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var configFile = path.resolve(getUserHome(), 'forms.config.js');

try {
	fs.lstatSync(configFile);

	require('../gulpfile');

	var config = require(configFile);

	GLOBAL._formsConfig = config;

	gulp.start('test');
}
catch (e) {
	console.log('No config file found:', configFile);

	console.log(e);

	process.exit(1);
}

