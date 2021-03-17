  Feature: Delete vin
  Scenario: As a manager I want to be able to remove VINS from the vehicles board
    Given a logged in user
    When there is a new vehicle on the Acquire column
    And the user selects the delete option on the vehicle menu
    Then the vehicle VIN is deleted successfully

  Scenario: As a manager I want to be able to cancel the deletion process 
    Given a logged in user
    When there is a new vehicle on the Acquire column
    And the user decides to cancel the deletion process
    Then the vehicle VIN is NOT deleted

  Scenario: As a manager I want to be able to remove VINS from the VIN dateils view
    Given a logged in user
    When there is a new vehicle on the Acquire column
    And the user selects the vehicle card from the vehciles board
    And the user press the Delete button displayed on the Vin details view
    Then the vehicle VIN is deleted successfully