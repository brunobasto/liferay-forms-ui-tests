var normalizer = require('./tests/unit/util/normalizer');
var resolveDependencies = require('./tests/unit/util/dependencies');

module.exports = function (karmaConfig) {
	resolveDependencies(function(files) {
		karmaConfig.set({
			frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'commonjs'],

			files: files.concat([
				'tests/unit/src/**/*.js'
			]),

			preprocessors: {
				'/**/*.js': ['transformPath', 'replacer'],
				'/**/*.css': ['transformPath'],
				'tests/unit/mocks/*.js': ['replacer'],
				'tests/unit/src/**/*.js': ['babel', 'commonjs']
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