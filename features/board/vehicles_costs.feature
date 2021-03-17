Feature: Validate vehicles costs information in board page

  Scenario: As a Used Car Manager, I want to see cars that cost LESS and MORE than normal
    Given a logged in user
    And some vehicles have been added to the sup app
    When a user set metrics values
    Then the user is able to see cars that cost LESS than normal

  Scenario: As a Used Car Manager, I want to see cars that cost MORE than normal
    Given a logged in user
    And some vehicles have been added with old dates to the sup app
    And new metrics have been set
    Then the user is able to see cars that cost MORE than normal


  Scenario: As a Used Car Manager, I want to see cars in gray color flag when there are no metrics
    Given a logged in user
    And some vehicles have been added to the sup app
    When there are no metrics set for a user
    Then the user is able to see cars in gray color flag