#ifndef SPOTGAME_STATE_H
#define SPOTGAME_STATE_H

// Represents game state.
enum GameState {
    // LED is turned on
    STATE_LED_TURNED_ON,
    // Pause
    STATE_PAUSE,
    // Game is over
    STATE_GAME_OVER,
    // Game won
    STATE_GAME_WON,
};

// Properties used on specific states.
struct GameStateProps {
    // Time when the last pause started (milliseconds).
    unsigned long pauseStartMillis;
    // Random duration of 'pause' period (milliseconds).
    unsigned long pauseDurationMillis;
    // The time when LED was turned on (milliseconds).
    unsigned long ledTurnedOnStartMillis;
    // Counter of correct presses.
    int correctCounter;
    // Counter of mistakes.
    int mistakesCounter;
    // Counter of missed presses.
    int missedCounter;
    // Counter of delays measured between the moment when LED was
    // turned on and button press.
    unsigned long correctDelayMillisCounter;
    // Protection aggainst multiple evaluation of button press
    // in various situations.
    bool pressButtonExecuteOnce;
    // Protection aggainst multiple evaluation of game done handler.
    bool doneExecuteOnce;
};

// Game state instance.
extern enum GameState gameState;
// Properties used on specific states instance.
extern GameStateProps gameStateProps;

#endif
