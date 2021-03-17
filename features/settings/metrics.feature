Feature: setting baseline metrics
  Scenario: As a Used Car Manager I'd like to set new baseline metrics
    Given a logged in user
    When the user clicks on the settings button
    And  the user sets the Holding cost and the turn rate fields
    And the user see the metrics begin to calculate
    Then the user goes back to the board and gets the ideal rate information

  Scenario: As a Used Car Manager I'd like to cancel the baseline metrics
    Given a logged in user
    When the user clicks on the settings button
    And new values are set and the cancel button is pressed
    Then the Holding cost and the turn rate values keep old values

  Scenario: As a Used Car Manager I'd like to validate negatives values on metrics
    Given a logged in user
    When the user clicks on the settings button
    And  negatives values are set and the save button is pressed
    Then new alert messages are shown and the save button is left as disabled
