'use strict';

var assert = chai.assert,
	server;

var respondEmpty = function() {
	server.requests[0].respond(
		200,
		{
			'Content-Length': '0',
			'Content-Type': 'text/plain'
		}
	);
};

describe('DDM Renderer Expressions Evaluator', function() {
	this.timeout(120000);

	before(function(done) {
		AUI().use(
			'liferay-ddm-form-renderer',
			'liferay-form',
			function(A) {
				done();
			}
		);
	});

	beforeEach(function(done) {
		server = sinon.fakeServer.create();

		done();
	});

	afterEach(function(done) {
		server.restore();

		done();
	});

	it('should not make a request when another request is already in progress', function(done) {
		var evaluator = new Liferay.DDM.Renderer.ExpressionsEvaluator({
			form: new Liferay.DDM.Renderer.Form({

			})
		});

		try {
			evaluator.evaluate();

			assert.lengthOf(server.requests, 1, 'should make a request after .evaluate()');

			evaluator.evaluate();

			assert.lengthOf(server.requests, 1, 'should not make a second one');

			server.requests[0].respond(
				200,
				{
					'Content-Type': 'application/json'
				}
			);

			setTimeout(function() {
				done();
			}, 100);
		}
		catch (e) {
			done(e);
		}
	});
});