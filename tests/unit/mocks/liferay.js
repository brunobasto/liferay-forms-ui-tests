window.Liferay = {
	AUI: {
		getAvailableLangPath: sinon.stub().returns('available_languages.js'),
		getCombine: sinon.stub().returns(false),
		getComboPath: sinon.stub().returns('/'),
		getEditorsPath: sinon.stub().returns('../../../../frontend-editors-web/src/META-INF'),
		getEditorCKEditorPath: sinon.stub().returns('../../../../frontend-editors-web/src/META-INF'),
		getFilter: sinon.stub().returns('raw'),
		getFilterConfig: sinon.stub().returns(null),
		getJavaScriptRootPath: sinon.stub().returns('/absolute/[%LIFERAY_PATH%]/modules/apps/platform/frontend/frontend-js-web'),
		getStaticResourceURLParams: sinon.stub().returns('')
	},

	Browser: {
		isIe: sinon.stub().returns(false)
	},

	ThemeDisplay: {
		getBCP47LanguageId: sinon.stub().returns('en_US'),
		getLanguageId: sinon.stub().returns('en_US'),
		getPathContext: sinon.stub().returns('/base'),
		getPathThemeImages: sinon.stub().returns('../../themes/classic/images'),
		getPortalURL: sinon.stub().returns('/'),
		isAddSessionIdToURL: sinon.stub().returns(false)
	}
};

window.themeDisplay = Liferay.ThemeDisplay;