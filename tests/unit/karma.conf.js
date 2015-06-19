var normalizer = require('./util/normalizer');
var resolveDependencies = require('./util/dependencies');

module.exports = function (karmaConfig) {
	resolveDependencies(function(files) {
		karmaConfig.set({
			frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'commonjs'],

			client: {
				mocha: {
					timeout: 20000
				}
			},

			files: files.concat([
				'src/**/*.js'
			]),

			preprocessors: {
				'/**/*.js': ['transformPath', 'replacer'],
				'/**/*.css': ['transformPath'],
				'mocks/*.js': ['replacer'],
				'src/**/*.js': ['babel', 'commonjs']
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