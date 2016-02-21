'use strict';

var assert = chai.assert;

describe('DDM Renderer Form Feedback Support', function() {
	before(function(done) {
		AUI().use(
			'liferay-ddm-form-renderer',
			function(A) {
				done();
			}
		);
	});

	it('should show a loading spinner on the form submit button after calling .showLoadingFeedback()', function(done) {
		var A = AUI(),
			formNode = A.Node.create('<form name="myFeedbackForm" id="myFeedbackForm" action="javascript:;"><button type="submit" /></form>');

		formNode.appendTo(document.body);

		var form = new Liferay.DDM.Renderer.Form({
			container: formNode
		});

		var submitButton = formNode.one('[type="submit"]');

		assert.ok(submitButton);

		form.showLoadingFeedback();

		assert.ok(submitButton.one('.icon-spinner'));

		form.destroy();

		formNode.remove();

		done();
	});
});