# SpotGame

Attention game for Arduino board with a few components and ability to report progress and results in the web application.

## Demo

![alt text](https://raw.githubusercontent.com/oplaner4/spotGame/master/arduino/preparedBoard.jpg)

## Necessary equipment
* Arduino board
* 1x red LED component
* 1x green LED component
* 1x LED component with other color
* 1x button component

## Description

* The goal of this attention game is to determine the moment (as accurately as possible) when a random blinking LED turns on by clicking a button.
* Button should not be pressed in the 'pause' period when the LED is turned off. This is considered a mistake.
* The first turning on occurs after minimal pause duration.
* When a player loses or wins the game (depends on the mode), the random blinking LED remains turned on as well as green / red LED which indicates win or loss. Arduino board has to be manually resetted.

### Reach final count correct mode

* Player always wins.
* The goal in this mode is to reach specific count of correct presses in the **shortest possible time** and do not exceed allowed **error rate index**.
* Permanently lighting green LED indicates end of the game.


### Until mistake mode
* Player always loses.
* The goal in this mode is to play for the **longest possible time**, until the **mistakes count tolerance** is exceeded.
* Mistake also occur in the situation when lighting of the LED was missed.
* Permanently lighting red LED indicates end of the game. 


## Installation

TODO

## Author

* Developed by Ondrej Planer ([oplaner4@gmail.com](mailto:oplaner4@gmail.com)).
* Co-workers: Vojtech Varecha (troubleshooter), Ondrej Nemec (idea), Jiri Pokorny (board).


## License

SpotGame can be freely distributed under the **MIT license**.
