# SpotGame - Arduino

This document contains essential information to compile and upload Arduino project with possible customizations.

## Prepare board

Necessary components:

* 1x red LED component
* 1x green LED component
* 1x LED component with other color
* 1x button component

Do not use Pin `0` and `1`. These are reserved for communication with Serial monitor.

## Structure

* Prepared board with all components: `./preparedBoard.jpg` picture.
* Arduino sketch: `./SpotGame` folder.

### Sketch

`*.h` files are used for declaration and explanation of variables / methods. These files **should not be modified**.

* `SpotGame.ino`: main file to be compiled and uploaded. Default settings can be changed here.
* `SpotGame.Settings.h`: just **declaration and explanation** of possible settings. Change `SpotGame.ino` file for **customization** of settings.
* `SpotGame.State.h`: declaration of game state and state props used by main program.
* `SpotGame.Serial.h` library: declaration of methods used for generating Serial output.
* `SpotGame.Serial.ino` library: implementation of methods described in `SpotGame.Serial.h`. Do not modify this file.

## Author

* Developed by Ondrej Planer ([oplaner4@gmail.com](mailto:oplaner4@gmail.com)).
* Co-workers: Ondrej Nemec (idea), Vojtech Varecha (troubleshooter), Jiri Pokorny (board).

## License

SpotGame can be freely distributed under the **MIT license**.
