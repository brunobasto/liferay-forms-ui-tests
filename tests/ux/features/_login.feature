Feature: Log in
    As an user
    I should be able to log in

Scenario: Open Portal Home
    Given I open the url "http://localhost:8080/"

Scenario: Log In
    When  I set "test@liferay.com" to the inputfield "#_58_login"
    And   I set "test" to the inputfield "#_58_password"
    And   I submit the form "#_58_fm"
    And   I wait on element "#_145_userAvatar .user-full-name"
    Then  I expect that element "#_145_userAvatar .user-full-name" contains the text "Test Test"