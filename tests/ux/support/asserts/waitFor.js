module.exports = function(elem, ms, state) {
	var command = 'waitForExist',
		done = arguments[arguments.length - 1];

	if (state) {
		state = state.indexOf(' ') > -1 ? state.split(/\s/)[1] : state;
		command = 'waitFor' + state[0].toUpperCase() + state.slice(1);
	}

	ms = parseInt(ms, 10) || 30000;
	this.browser[command](elem, ms).call(done);
};