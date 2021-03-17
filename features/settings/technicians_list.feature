Feature: Setting Technicians list test scenarios

  Scenario: As a user I would like to add new technician info
    Given a logged in user
    When  the user clicks on Technicians List option
    And   the user is able to add a new Technicians number to the list
    Then  the technician will appear in the list

  Scenario: As a user I would like to Update the technician info
    Given a logged in user
    When the user clicks on Technicians List option
    And the user clicks on the edit button on the technician to update
    And the user update the technician info
    Then the technician will updated in the list

  Scenario: As a user I would like to Delete the technician
    Given a logged in user
    When  the user clicks on Technicians List option
    And   the user clicks on the remove button
    And   the user confirms the modal to remove the technician
    Then  the technician will be remove from the list

  Scenario: As a user I would like to set an existing Technician cell Phone number
    Given a logged in user
    When  the user clicks on Technicians List option
    And   the user set a duplicate technicians cell phone number
    Then  the Sup app will show to the user a validation message