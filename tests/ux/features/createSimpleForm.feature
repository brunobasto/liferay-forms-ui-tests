Feature: Create a Simple Form
    As an user
    I should be able to create a simple form from scratch

Scenario: Open Portal Home
    Given I open the url "http://localhost:8080/"

Scenario: Log In
    When  I set "test@liferay.com" to the inputfield "#_58_login"
    And   I set "test" to the inputfield "#_58_password"
    And   I submit the form "#_58_fm"
    And   I wait on element "#_145_userAvatar .user-full-name"
    Then  I expect that element "#_145_userAvatar .user-full-name" contains the text "Test Test"

Scenario: Go to Control Panel
    When  I click on the element "#_145_adminLinks > a"
    And   I click on the element "#_145_siteAdministrationLink-site_administration\2e content"
    And   I wait on element "#_145_dockbar > div > div > h1 > span"
    Then  I expect that element "#_145_dockbar > div > div > h1 > span" contains the text "Site Administration"

Scenario: Go to Forms
    Given the element "#_145_dockbar > div > div > h1 > span" does contain the text "Site Administration"
    And   I click on the element "#_com_liferay_control_panel_menu_web_portlet_ControlPanelMenuPortlet_portlet_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet"
    When  I wait on element "#cpPortletTitle > span.portlet-title-text"
    Then  I expect that element "#cpPortletTitle > span.portlet-title-text" contains the text "Forms"

Scenario: Click on Add
    When  I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_addButtonContainer > a"
    And   I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_addButtonContainer > ul > li > a"

Scenario: Fill Name and Description
    When  I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_nameEditor"
    And   I press "My Form"
    And   I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_descriptionEditor"
    And   I press "My Form description"

Scenario: Add a Text Field
    When  I click on the element "//*[@id='_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_formBuilder']/div/div/div[3]/div[1]/div/div/div/div[1]/div/div/div[2]/div/span"
    And   I click on the element "/html/body/div[2]/div/div[2]/div/div[2]"
    And   I press "first_name"
    And   I click on the element "/html/body/div[2]/div/div[1]/form/div[6]/div/input"
    And   I press "First Name"
    And   I click on the element "/html/body/div[2]/div/div[2]/div/button[2]"

Scenario: Submit
    When  I submit the form "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_editForm"
    Then  I expect that element ".alert-success" is visible