var isparta = require('isparta');
var normalizer = require('./util/normalizer');
var resolveDependencies = require('./util/dependencies');

module.exports = function (karmaConfig) {
	resolveDependencies(function(files) {
		karmaConfig.set({
			frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'commonjs'],

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

			preprocessors: {
				'/**/*.js': ['transformPath', 'replacer'],
				'/**/*.css': ['transformPath'],
				'/**/dynamic-data-mapping/**/resources/**/!(*.soy).js': ['coverage'],
				'/**/dynamic-data-lists/**/resources/**/!(*.soy).js': ['coverage'],
				'mocks/*.js': ['replacer'],
				'src/**/*.js': ['babel', 'commonjs']
			},

			browsers: ['Chrome'],

			reporters: ['coverage', 'progress', 'threshold'],

			babelPreprocessor: {
				options: {
					sourceMap: 'both'
				}
			},

			coverageReporter: {
				instrumenters: {
					isparta : isparta
				},
				instrumenter: {
					'**/*.js': 'isparta'
				},
				reporters: [
					{
						type: 'html'
					},
					{
						subdir: 'lcov',
						type: 'lcov'
					},
					{
						type: 'text-summary'
					}
				]
			},

			replacerPreprocessor: {
				replacer: normalizer.normalizeContent
			},

			thresholdReporter: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100
			},

			transformPathPreprocessor: {
				transformer: normalizer.normalizePath
			}
		});
	});
};