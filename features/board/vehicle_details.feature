  Feature: validate details on vin view
  Scenario: As a Used Car Manager I want to click a tile and view deeper details on a given VIN
    Given a logged in user
    When a new vehicle has been created
    And the user has selected the vehicle card
    Then a new view with the vin details is displayed
    
  Scenario: As a Used Car Manager I want to validate record info for a vehicle that moves through multiples steps.  
    Given a logged in user
    And new vehicles with old dates time have been created
    When it exists in the Acquired column it must contain steps record info 
    Then it must contain steps record in the Inspection column
    And it must contain steps record in the Recondition column
    And it must contain steps record in the Detail column
    And it finally must contain steps record in the Done column
