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
* When a player loses or wins the game (depends on the mode), the random blinking LED remains turned on as well as green / red LED which indicates win or loss. Arduino board has to be manually resetted then.

### Reach final count correct mode

* Player always wins.
* The goal in this mode is to reach specific count of correct presses in the **shortest possible time** and do not exceed allowed **error rate index**.
* Permanently lighting green LED indicates end of the game.


### Until mistake mode
* Player always loses.
* The goal in this mode is to play for the **longest possible time**, until the **mistakes count tolerance** is exceeded.
* Mistake also occurs in the situation when 'LED turned on' period was missed.
* Permanently lighting red LED indicates end of the game. 

## Arduino project

Project is located in `./arduino` folder. More information can be found in separate [README](https://github.com/oplaner4/spotGame/tree/master/arduino).

## Web Application project

Project is located in `./webApp` folder. More information can be found in separate [README](https://github.com/oplaner4/spotGame/tree/master/webApp).

## Build & Installation

1) Prepare Arduino board and components based on the `./arduino/preparedBoard.jpg`.
2) Customize settings in `./arduino/SpotGame/SpotGame.ino` and upload this file to your Arduino board.
3) Make sure that Serial monitor is **closed** in the Arduino IDE.

### Windows
4) Open `./CoolTermWin/RedirectArduinoSerial.stc` file in `./CoolTermWin/CoolTerm.exe`, customize Arduino Serial Port and click the 'Connect' button.
* **Unix systems**: redirect Arduino Serial **/dev/ttyUSB0** into `./webApp/data/serial.txt` file.
5) Continue with steps described in this [README](https://github.com/oplaner4/spotGame/tree/master/webApp (in the `./webApp` folder).

### Unix systems

4) Redirect Arduino Serial **/dev/ttyUSB0** into `./webApp/data/serial.txt` file.
5) Create MySQL database called `spotgame` and call `./webApp/databases/create.sql` SQL script.
6) Connection to the database can be changed in `./webApp/databases/access/connection.php`.
7) Run PHP server with `./webApp` as root directory and `index.php` as an entry point.

## Author

* Developed by Ondrej Planer ([oplaner4@gmail.com](mailto:oplaner4@gmail.com)).
* Co-workers: Ondrej Nemec (idea), Vojtech Varecha (troubleshooter), Jiri Pokorny (board).

## License

SpotGame can be freely distributed under the **MIT license**.
