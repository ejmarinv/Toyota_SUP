Feature: Board with default columns
  Scenario: As a Used Car Manager I'd like to see a default set of columns when I first log in so that I can use the application quickly
    Given a logged in user
    When is able to see the board
    Then the default columns should show up
