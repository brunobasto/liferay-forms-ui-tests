(function() {
	var openerFn = Liferay.Util.getOpener;

	Liferay.Util.getOpener = function() {
		var opener = openerFn();

		opener.Liferay = Liferay;

		return opener;
	};
})();