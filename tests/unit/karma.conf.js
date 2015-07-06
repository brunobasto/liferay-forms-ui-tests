var normalizer = require('./util/normalizer');
var resolveDependencies = require('./util/dependencies');

module.exports = function (karmaConfig) {
	resolveDependencies(function(files) {
		karmaConfig.set({
			browsers: ['Chrome'],

			frameworks: ['chai', 'commonjs', 'mocha', 'sinon'],

			files: files.concat([
				'src/**/*.js',
				{
					included: false,
					pattern: 'src/**/assets/*.json'
				},
				{
					included: false,
					pattern: 'src/**/assets/*.html'
				}
			]),

			reporters: ['mocha'],

			preprocessors: {
				'/**/*.js': ['transformPath', 'replacer'],
				'/**/*.css': ['transformPath'],
				'mocks/*.js': ['replacer'],
				'src/**/*.js': ['commonjs']
			},

			replacerPreprocessor: {
				replacer: normalizer.normalizeContent
			},

			transformPathPreprocessor: {
				transformer: normalizer.normalizePath
			}
		});
	});
};