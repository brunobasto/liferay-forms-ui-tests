var normalizer = require('./util/normalizer');
var resolveDependencies = require('./util/dependencies');

module.exports = function (karmaConfig) {
	resolveDependencies(function(files) {
		karmaConfig.set({
			frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'commonjs'],

			files: files.concat([
				'config.js',
				'tests/unit/**/*.js'
			]),

			preprocessors: {
				'/**/*.js': ['transformPath', 'replacer'],
				'/**/*.css': ['transformPath'],
				'config.js': ['babel', 'commonjs'],
				'tests/unit/**/*.js': ['babel', 'commonjs'],
				'mocks/*.js': ['replacer']
			},

			browsers: ['Chrome'],

			babelPreprocessor: {
				options: {
					sourceMap: 'both'
				}
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