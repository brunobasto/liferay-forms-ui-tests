'use strict';

var fs = require('fs');
var properties = require('properties');

var Properties = {
	preprocess: function(contents) {
		return contents.replace(/\s*#.*/g, '');
	},

	read: function(fileName, callback) {
		var instance = this;

		var contents = fs.readFileSync(
			fileName,
			{
				encoding: 'utf8'
			}
		);

		properties.parse(
			instance.preprocess(contents),
			{
				path: false
			},
			function(error, obj) {
				if (error) {
					return console.error(error);
				};

				callback.call(instance, [obj]);
			}
		);
	}
};

module.exports = Properties;