#ifndef SPOTGAME_STATE_H
#define SPOTGAME_STATE_H

enum GameState {
    // LED je zapnuta
    STATE_LED_TURNED_ON,
    // Pauza
    STATE_PAUSE,
    // Hra prohrana
    STATE_GAME_OVER,
    // Hra vyhrana
    STATE_GAME_WON,
};

struct GameStateProps {
    // Cas, kdy zacala posledni pauza
    unsigned long pauseStartMillis;
    // Nahodna doba, po kterou trva pauza.
    unsigned long pauseDurationMillis;
    // Cas, kdy zacala naposledy svitit LED.
    unsigned long ledTurnedOnStartMillis;
    // Pocitadlo spravnych stisknuti.
    int correctCounter;
    // Pocitadlo chybnych stisknuti.
    int mistakesCounter;
    // Pocitadlo zameskanych stisknuti.
    int missedCounter;
    // Soucet zpozdeni od rozsviceni LED a zmacknuti
    // tlacitka.
    unsigned long correctDelayMillisCounter;
    // Ochrana proti vycenasobnemu vyhodnoceni stisknuti
    // tlacitka.
    bool pressButtonExecuteOnce;
    // Ochrana proti vycenasobnemu ukonceni hry.
    bool doneExecuteOnce;
};

// Stav hry
extern enum GameState gameState;
// Data k ruznym stavum hry
extern GameStateProps gameStateProps;

#endif
