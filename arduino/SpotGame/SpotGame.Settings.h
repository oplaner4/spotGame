// This file only DECLARES available settings.
// Go to SpotGame.ino and init**Settings methods for
// SPECIFICATION of settings.

#ifndef SPOTGAME_SETTINGS_H
#define SPOTGAME_SETTINGS_H

// Defines available game modes.
enum GameMode {
    // Play 'reach final count of correct presses' mode.
    MODE_REACH_FINAL_COUNT_CORRECT,
    // Play more difficult 'until mistake' mode.
    MODE_UNTIL_MISTAKE_MODE,
};

// Defines used Pins on Arduino board.
struct PinSettings {
    // Pin number of random blinking LED.
    int randomBlinkingLed;
    // Pin number of LED representing mistake.
    int mistakeLedRed;
    // Pin number of LED representing correct press.
    int correctLedGreen;
    // Pin number of button which should be pressed
    // when random blinking LED is turned on.
    int pressButton;
};

// Defines game settings.
struct GameSettings {
    // Minimal duration of pause between turning LED off and
    // turning LED on (milliseconds).
    int minPauseMillis;
    // Maximal duration of pause between turning LED off and
    // turning LED on (milliseconds).
    int maxPauseMillis;
    // Duration of LED being turned on. During this period
    // the button should be pressed (milliseconds).
    int ledTurnedOnDurationMillis;
    // Wait for specific time when score (counter) is changed
    // so that player is able to notice that change (milliseconds).
    int waitAfterCounterChangeMillis;
    // Game mode to use (see available modes above).
    enum GameMode mode;
    // MODE_REACH_FINAL_COUNT_CORRECT only: final count of correct presses.
    int finalCountCorrect;
    // MODE_REACH_FINAL_COUNT_CORRECT only: maximal allowed error rate for game to be
    // completed. For instance, to prevent user from pressing button continuously.
    // Game (including counters) is resetted. As a consequence, player just wastes time.
    // Example:
    //      m = allowable count of mistakes.
    //      c = final count of correct presses.
    //      maxErrorRateIndex = m / c
    double maxErrorRateIndex;
    // MODE_UNTIL_MISTAKE_MODE only: tolerated count of mistakes. Use zero when no
    // mistakes can occur. Missed 'LED turned on' period is considered a mistake as well.
    int mistakesCountTolerance;
};

// Pin settings instance.
extern PinSettings pinSettings;
// Game settings instance.
extern GameSettings gameSettings;

#endif
