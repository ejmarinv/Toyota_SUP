  Feature: Editing vin data
  Scenario: As a Service Manager I want to be able to edit a Toyota vehicle data associated to a VIN
    Given a logged in user
    When a new Toyota vehicle exists on the Acquired column
    And the user selects the Edit option from the vehicle menu    
    Then a new screen allows the user to edit the VIN data on mandatory fields 
    And the user validates the data changed from the vehicles board 

   Scenario: As a Service Manager I want to be able to cancel the edition process
    Given a logged in user
    When a new Toyota vehicle exists on the Acquired column
    And the user selects the Edit option from the vehicle menu
    Then the user Cancel the edition process

  Scenario: As a Service Manager I want to be validate the edition process does not allow negatives values
    Given a logged in user
    When a new Toyota vehicle exists on the Acquired column
    And the user selects the Edit option from the vehicle menu
    And the user decides to set negative values on editing form
    Then the edition form throws error messages about negatives values not allowed

   Scenario: As a Service Manager I want to be able to edit a lexus vehicle with mandatory fields 
     Given a logged in user
     When a new Lexus vehicle exists on the Acquired column
     And the user selects the Edit option from the Lexus menu
     Then the editing screen allows the user to set new Tesla vehicle data
     And the user validates the Tesla data from the vehicles board
     And the user selects the Lexus vehicle card from the vehicles board
     And the user validates the Tesla data on VIN details screen

  Scenario: As a Service Manager I want to be able to edit a Lexus vehicle from Vin details view page 
    Given a logged in user
    When a new Lexus vehicle exists on the Acquired column
    And the user selects the Lexus vehicle card from the vehicles board
    And the user selects the Edit button to set new Tesla vehicle data from VIN details screen
    Then the editing screen allows the user to set new Tesla vehicle data
    And  the user goes back to the VIN details screen 
    And  the user validates the Tesla data on VIN details screen