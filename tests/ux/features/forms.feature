Feature: Navigate to Liferay Portal home page
    As an user
    I should be able to navigate to the Liferay Portal home page

Scenario: open URL
    Given I open the url "http://liferay:r3m3mb3r@master.liferay.org.es/"

Scenario: log in
    When  I set "test@liferay.com" to the inputfield "#_58_login"
    And   I set "test" to the inputfield "#_58_password"
    And   I submit the form "#_58_fm"
    When  I wait on element "#_145_userAvatar .user-full-name"
    Then  I expect that element "#_145_userAvatar .user-full-name" contains the text "Test fff Test"

Scenario: go to Control Panel
    When  I click on the element "#_145_adminLinks > a"
    And   I click on the element "#_145_siteAdministrationLink-site_administration\2e content"
    When  I wait on element "#_145_dockbar > div > div > h1 > span"
    Then  I expect that element "#_145_dockbar > div > div > h1 > span" contains the text "Site Administration"

Scenario: go to Forms
    Given the element "#_145_dockbar > div > div > h1 > span" does contain the text "Site Administration"
    And   I click on the element "#_com_liferay_control_panel_menu_web_portlet_ControlPanelMenuPortlet_portlet_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet"
    When  I wait on element "#cpPortletTitle > span.portlet-title-text"
    Then  I expect that element "#cpPortletTitle > span.portlet-title-text" contains the text "Forms"

Scenario: add a Form
    Given the element "#cpPortletTitle > span.portlet-title-text" does contain the text "Forms"
    And   I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_addButtonContainer > a"
    And   I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_addButtonContainer > ul > li > a"
    And   I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_nameEditor"