Feature: Google search should
    As a googler
    I should be able to search for stuff

Scenario: search for 'liferay'
    Given the page url is not "http://google.com/"
    And   I open the url "http://google.com/"
    And   the inputfield "//*[@name='q']" does not contain the text "abc"
    When  I add "liferay" to the inputfield "//*[@name='q']"
    Then  I expect that inputfield "//*[@name='q']" contains the text "liferay"
    When  I click on the button "//*[@name='btnG']"
    Then  I expect that element "#resultStats" contains the text "resultados"
