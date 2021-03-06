Feature: Create a Form with a Select field
    As an user
    I should be able to create a form with a select field

Scenario: Open Portal Home
    Given I open the url "http://localhost:8080/"

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
    And   I press "Form with Select"
    And   I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_descriptionEditor"
    And   I press "Form with Select description"

@Pending
Scenario: Add a Select Field
    When  I click on the element "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_formBuilder > div > div > div.form-builder-layout.layout-builder-resize-col-enabled > div.layout-builder-layout-container > div > div > div > div.col.col-md-12 > div > div > div.form-builder-field-list-add-button.form-builder-field-list-add-button-visible > div > span"
    And   I click on the element "body > div.form-builder-modal.yui3-widget.modal-dialog.yui3-widget-positioned.yui3-widget-stacked.yui3-widget-modal.modal-dialog-focused > div > div.yui3-widget-bd.modal-body > div > div:nth-child(1)"
    And   I click on the element "body > div:nth-child(2) > div > div.yui3-widget-bd.modal-body > form > div:nth-child(2) > div > input"
    And   I press "number_of_children"
    And   I click on the element "body > div:nth-child(2) > div > div.yui3-widget-bd.modal-body > form > div:nth-child(4) > div > input"
    And   I press "Number of Children"
    And   I click on the element "body > div:nth-child(2) > div > div.yui3-widget-bd.modal-body > form > div:nth-child(16) > div > div > div.ddm-options-row.lfr-form-row.yui3-dd-drop > div:nth-child(2) > div:nth-child(1) > input"
    And   I press "One"
    And   I click on the element "body > div:nth-child(2) > div > div.yui3-widget-bd.modal-body > form > div:nth-child(16) > div > div > div.ddm-options-row.lfr-form-row.yui3-dd-drop > div:nth-child(2) > div:nth-child(2) > input"
    And   I press "1"
    And   I click on the element ".form-builder-field-settings-save"

Scenario: Submit
    When  I submit the form "#_com_liferay_dynamic_data_lists_form_web_portlet_DDLFormAdminPortlet_editForm"
    Then  I expect that element ".alert-success" is visible