var normalizer = require('./util/normalizer');
var resolveDependencies = require('./util/dependencies');

module.exports = function (karmaConfig) {
	resolveDependencies(function(files) {
		karmaConfig.set({
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

			preprocessors: {
				'/**/*.js': ['transformPath', 'replacer'],
				'/**/*.css': ['transformPath'],
				'/**/dynamic-data-mapping/**/resources/**/!(*.soy).js': ['coverage'],
				'/**/dynamic-data-lists/**/resources/**/!(*.soy).js': ['coverage'],
				'mocks/*.js': ['replacer'],
				'src/**/*.js': ['commonjs']
			},

			browsers: ['Chrome'],

			reporters: ['coverage', 'progress', 'threshold'],

			coverageReporter: {
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
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80
			},

			transformPathPreprocessor: {
				transformer: normalizer.normalizePath
			}
		});
	});
};