enum GameMode {
    // hrat mod dosahnuti poctu uspesnych stisknuti
    MODE_REACH_FINAL_COUNT_CORRECT,
    // hrat tezsi mod dokud se hrac nespete
    // ignoruje cilovy pocet spravnych stisknuti
    MODE_UNTIL_MISTAKE_MODE,
};


struct GameState {
    unsigned long intervalRandomPauseElapsedMiliseconds;
    unsigned long intervalRandomPauseMiliseconds;
    unsigned long intervalLedTurnedOnDurationElapsedMiliseconds;
    int correctCounter;
    int mistakesCounter;
    int missedCounter;
    bool ledBlinkingMode;
    bool gameOver;
    bool gameCompleted;
    bool buttonPressedExecuteOnce;
    bool gameDoneExecuteOnce;
};

GameState useGameState;