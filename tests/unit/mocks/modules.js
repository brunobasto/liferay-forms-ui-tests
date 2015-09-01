var jsRootPath = Liferay.AUI.getJavaScriptRootPath();

YUI_config.base = jsRootPath + '/tmp/META-INF/resources/aui/';
YUI_config.root = jsRootPath + '/tmp/META-INF/resources/aui/';

var groupsPath = jsRootPath + '/src/META-INF/resources';

YUI_config.groups.editor.base = groupsPath + '/editor/';
YUI_config.groups.editor.root = groupsPath + '/editor/';

YUI_config.groups.liferay.base = groupsPath + '/liferay/';
YUI_config.groups.liferay.root = groupsPath + '/liferay/';

YUI_config.groups.misc.base = groupsPath + '/misc';
YUI_config.groups.misc.root = groupsPath + '/misc';

YUI_config.groups.portal.base = jsRootPath + '/test/src/';
YUI_config.groups.portal.root = jsRootPath + '/test/src/';

YUI_config.groups.mock = {
	base: '/base/mocks/',
	modules: {
		'liferay-language-mock': {
			condition: {
				name: 'liferay-language-mock',
				trigger: 'liferay-language',
				when: 'instead'
			},
			path: 'available_languages.js'
		}
	},
	root: '/base/mocks/'
};