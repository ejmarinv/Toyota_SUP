Feature: Validate vehicle time information in board page
  Scenario: As a Used, I'd like to see how many hours/days and total hours/days per column into the step vehicle process
    Given a logged in user
    And some vehicles have been added to the sup app with an specific time and in diferent columns
    When a user goes to the board
    Then the user validates how long a car has been in the whole process
    Then the user validates how long a car has been in a specific step

  Scenario: As a Used, I'd like to see how many time the vehicle keeps and change after drag and drop
    Given a logged in user
    And a vehicle has been added to the sup app with an specific time
    When a user goes to the board
    When a vehicle is moved to the next column
    Then the user validates the vehicle keeps the total time
    Then the user validates the time in step is zero