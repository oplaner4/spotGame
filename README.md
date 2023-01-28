# SpotGame

Attention game for Arduiono board with a few components and ability to report progress and results in the web application.

## Description

* The goal of this attention game is to determine the moment when a random blinking LED turns on by clicking a button.
* The first turning on does not happen earlier than after the minimal pause between turning on/off.
* When a player loses or wins the game (depends on the mode), the random blinking LED keeps turned on and green or red LED indicates winn or loss.

### Reach final count correct mode

* The goal in this mode is to reach specific count of correct presses in the **shortest possible time**.
* The game is always won.

### Until mistake mode

* The goal in this mode is to play for the **longest possible time**, until the mistakes count tolerance is exceeded.
* The game is always lost.

## Author

* Developed by Ondrej Planer ([oplaner4@gmail.com](mailto:oplaner4@gmail.com)).
* Coworkers: Vojtech Varecha, Ondrej Nemec, Jiri Pokorny.


## License

SpotGame can be freely distributed under the **MIT license**.
