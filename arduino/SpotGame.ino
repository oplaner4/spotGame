#include "SpotGame.State.h";
#include "SpotGame.Serial.h";
#include "SpotGame.Settings.h";

// Ondrej Planer, oplaner4@gmail.com, 10/2019
// SPOT GAME


// _____________________________________________________________________________________
// EQUIPMENT

// 3x LED - red, green and other color.
// Button

// _____________________________________________________________________________________
// SETTINGS

GameState gameState;
GameStateProps gameStateProps;
PinSettings pinSettings;
GameSettings gameSettings;

void initPinSettings () {
    pinSettings = {};

    // DO NOT USE PIN 0 and 1, THE PROGRAM WOULD NOT WORK PROPERLY.
    // THESE ARE RESERVED FOR COMMUNICATION WITH SERIAL MONITOR.
    pinSettings.randomBlinkingLed = 6;
    pinSettings.mistakeLedRed = 4;
    pinSettings.correctLedGreen = 2;
    pinSettings.pressButton = 5;

    // Check SpotGame.Settings.h file for detailed information.
    return pinSettings;
}

void initGameSettings () {
    gameSettings = {};
    gameSettings.minPauseMillis = 800;
    gameSettings.maxPauseMillis = 3000;
    gameSettings.ledTurnedOnDurationMillis = 300;
    gameSettings.waitAfterCounterChangeMillis = 500;
    gameSettings.mode = MODE_REACH_FINAL_COUNT_CORRECT;
    gameSettings.finalCountCorrect = 10;
    gameSettings.maxErrorRateIndex = 5.0/(double)gameSettings.finalCountCorrect;
    gameSettings.mistakesCountTolerance = 3;

    // Check SpotGame.Settings.h file for detailed information.
    return gameSettings;
}

int getRandomPauseMillis () {
  return random(gameSettings.minPauseMillis, gameSettings.maxPauseMillis);
}

bool errorRateIndexExceeded() {
    return (double)gameStateProps.mistakesCounter / (double)gameStateProps.correctCounter > gameSettings.maxErrorRateIndex;
}

void onGameDone() {
    digitalWrite(pinSettings.randomBlinkingLed, HIGH);

    // Manual reset of the board is necessary to start a new game.

    if (gameState == STATE_GAME_OVER) {
        digitalWrite(pinSettings.mistakeLedRed, HIGH);
        writeToSerialMonitor ("Hra prohrána", "gameOver", gameSettings, gameStateProps);
    }
    else {
        digitalWrite(pinSettings.correctLedGreen, HIGH);
        writeToSerialMonitor ("Hra dokončena", "gameCompleted", gameSettings, gameStateProps);
    }
}

void onFinalCountCorrectReached() {
    // 'Reach final count correct' mode

    if (errorRateIndexExceeded()) {
        // The error rate was exceeded thus game cannot be completed.
        // Play again by resetting all counters.
        gameStateProps.mistakesCounter = 0;
        gameStateProps.correctCounter = 0;
        gameStateProps.missedCounter = 0;
        writeToSerialMonitor("Překročena maximální povolená chybovost", "maxErrorRateIndexExceed", gameSettings, gameStateProps);
    }
    else {
        gameState = STATE_GAME_WON;
    }
}

void evalCorrect(long currentMillis) {
    digitalWrite(pinSettings.correctLedGreen, HIGH);

    gameStateProps.correctCounter += 1;
    gameStateProps.correctDelayMillisCounter += currentMillis - gameStateProps.ledTurnedOnStartMillis;

    writeToSerialMonitor("Zvýšen počet správných stisknutí na: " + String(gameStateProps.correctCounter)
        + (gameSettings.mode == MODE_REACH_FINAL_COUNT_CORRECT ? (" z "+ String(gameSettings.finalCountCorrect) + " cílových") : ""),
        "correctCountIncreased", gameSettings, gameStateProps);

    if (gameSettings.mode == MODE_REACH_FINAL_COUNT_CORRECT && gameStateProps.correctCounter >= gameSettings.finalCountCorrect) {
        onFinalCountCorrectReached();
    }

    delay(gameSettings.waitAfterCounterChangeMillis);
}

void evalMistake() {
    digitalWrite(pinSettings.mistakeLedRed, HIGH);

    gameStateProps.mistakesCounter += 1;

    writeToSerialMonitor("Zvýšen počet špatných stisknutí na: " + String(gameStateProps.mistakesCounter)
        + (gameSettings.mode == MODE_UNTIL_MISTAKE_MODE ? (" z " + String(gameSettings.mistakesCountTolerance) + " tolerovaných") : ""),
        "mistakesCountIncreased", gameSettings, gameStateProps);

    if (gameSettings.mode == MODE_UNTIL_MISTAKE_MODE && gameStateProps.mistakesCounter > gameSettings.mistakesCountTolerance) {
        // In 'until mistake' mode: mistakes count tolerance was exceeded.
        writeToSerialMonitor("Počet dosažených správných stisknutí: " + String(gameStateProps.correctCounter),
        "correctCountReached", gameSettings, gameStateProps);
        gameState = STATE_GAME_OVER;
    }

    delay(gameSettings.waitAfterCounterChangeMillis);
}

void evalLedTurnedOnState(long currentMillis) {
    digitalWrite(pinSettings.randomBlinkingLed, HIGH);
    digitalWrite(pinSettings.mistakeLedRed, LOW);
  
    if (digitalRead(pinSettings.pressButton) == HIGH) {
        // Pressed button
        if (gameStateProps.pressButtonExecuteOnce) {
            evalCorrect(currentMillis);
            gameStateProps.pressButtonExecuteOnce = false;
        }
    }
}

void evalPauseState() {
    digitalWrite(pinSettings.randomBlinkingLed, LOW);
    digitalWrite(pinSettings.correctLedGreen, LOW);

    if (digitalRead(pinSettings.pressButton) == HIGH) {
        // Pressed button
        if (gameStateProps.pressButtonExecuteOnce) {
            evalMistake();
            gameStateProps.pressButtonExecuteOnce = false;
        }
    }
}

void evalOnMissed() {
    gameStateProps.missedCounter += 1;

    if (gameSettings.mode == MODE_UNTIL_MISTAKE_MODE) {
        // In 'until mistake' mode it is considered a mistake.
        evalMistake();
    }
}

void setup() {
    // The game begins with pause.
    gameState = STATE_PAUSE;
    gameStateProps = {};
    gameStateProps.pauseStartMillis = 0;
    gameStateProps.pauseDurationMillis = getRandomPauseMillis();
    gameStateProps.ledTurnedOnStartMillis = 0;
    gameStateProps.correctCounter = 0;
    gameStateProps.mistakesCounter = 0;
    gameStateProps.missedCounter = 0;
    gameStateProps.correctDelayMillisCounter = 0;
    gameStateProps.pressButtonExecuteOnce = true;
    gameStateProps.doneExecuteOnce = true;

    initGameSettings();
    initPinSettings();

    pinMode(pinSettings.randomBlinkingLed, OUTPUT);
    pinMode(pinSettings.mistakeLedRed, OUTPUT);
    pinMode(pinSettings.correctLedGreen, OUTPUT);
    pinMode(pinSettings.pressButton, INPUT);

    Serial.begin(9600);
    writeToSerialMonitor("Arduino deska úspěšně resetována", "arduinoBoardReseted", gameSettings, gameStateProps);
    writeToSerialMonitor("Hra spuštěna", "gameInitialized", gameSettings, gameStateProps);
}

void loop() {
    unsigned long currentMillis = millis();

    if (gameState == STATE_GAME_OVER || gameState == STATE_GAME_WON) {
        if (gameStateProps.doneExecuteOnce) {
            onGameDone();
            gameStateProps.doneExecuteOnce = false;
        }
    }
    else if (gameState == STATE_LED_TURNED_ON) {
        evalLedTurnedOnState(currentMillis);
        
        if (currentMillis - gameStateProps.ledTurnedOnStartMillis >= gameSettings.ledTurnedOnDurationMillis) {
            // The end of 'LED turned on' period.
            gameState = STATE_PAUSE;
            gameStateProps.pauseStartMillis = currentMillis;
            gameStateProps.pauseDurationMillis = getRandomPauseMillis();

            if (gameStateProps.pressButtonExecuteOnce) {
                evalOnMissed();
            }
            
            gameStateProps.pressButtonExecuteOnce = true;
        }
    }
    else {
        evalPauseState();

        if (currentMillis - gameStateProps.pauseStartMillis >= gameStateProps.pauseDurationMillis) {
            // The end of 'pause' period.
            gameState = STATE_LED_TURNED_ON;
            gameStateProps.ledTurnedOnStartMillis = currentMillis;

            gameStateProps.pressButtonExecuteOnce = true;
        }
    }
}
