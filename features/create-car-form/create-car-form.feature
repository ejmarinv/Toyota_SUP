Feature: Car creation
  Scenario: As a Dealer I want to add a Vehicle to the system with the required fields
    Given a logged in user
    When is able to see the board
    And clicks on the Add Vehicle button
    And fills the required fields on the vehicle form
    And uncheck add another check button
    And press the save button
    Then the vehicle should be saved
    Then the created vehicle should exist in board

  Scenario: As a Dealer I can't add a Vehicle to the system without the required fields
    Given a logged in user
    When is able to see the board
    And clicks on the Add Vehicle button
    And fills some of the required fields on the vehicle form
    And press the save button
    Then the vehicle should not be saved

  Scenario: As a Dealer I want to add a Lexus Vehicle to the system with the Lexus required fields
    Given a logged in user
    When is able to see the board
    And clicks on the Add Vehicle button
    And selects Lexus as Brand
    And fills the required fields on the vehicle form for Lexus
    And press the save button
    Then the vehicle should be saved

  Scenario: As a Dealer I can't add a Lexus Vehicle to the system without the Lexus required fields
    Given a logged in user
    When is able to see the board
    And clicks on the Add Vehicle button
    And selects Lexus as Brand
    And fills some of the required fields on the vehicle form for Lexus
    And press the save button
    Then the vehicle should not be saved
 
  Scenario: As a Dealer I want to go back to the board whe I press the Cancel Button
    Given a logged in user
    When is able to see the board
    And clicks on the Add Vehicle button
    And press the cancel button
    Then The form should be hidden
    Then the created vehicle should not exist in board

  Scenario: As a Dealer I want to create a new vehicle with negatives values
    Given a logged in user
    When is able to see the board
    And clicks on the Add Vehicle button
    And fills the required fields setting negatives values 
    And press the save button
    Then the vehicle should be not be created

