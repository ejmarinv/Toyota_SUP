Feature: Scenarios of vehicles moved between stages columns
  Scenario: As a Used Car Manager, I'd like to move forward Toyota cars between stages columns
    Given a logged in user
    And a Toyota vehicle has been added to the sup app 
    When a user move forward the Toyota car through each column
    Then finally the Toyota car must exist in the last column