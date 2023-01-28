#ifndef SPOTGAME_SETTINGS_H
#define SPOTGAME_SETTINGS_H

// Definuje ruzne mody hry
enum GameMode {
    // hrat mod dosahnuti poctu uspesnych stisknuti
    MODE_REACH_FINAL_COUNT_CORRECT,
    // hrat tezsi mod dokud se hrac nespete
    // ignoruje cilovy pocet spravnych stisknuti
    MODE_UNTIL_MISTAKE_MODE,
};

struct PinSettings {
    // pin nahodne blikajici led
    int randomBlinkingLed;

    // pin led signalizujici chybu
    int mistakeLedRed;

    // pin led signalizujici uspesne stisknuti
    int correctLedGreen;

    // pin tlacitka, ktere se ma stisknout pri rozsviceni nahodne blikajici led
    int pressButton;
};

struct GameSettings {
    // minimalni delka pausy mezi bliknutimi v milisekundach
    int minPauseMillis;

    // maximalni delka pausy mezi bliknutimi v milisekundach
    int maxPauseMillis;

    // delka trvani rozsvicene led (behem teto doby se musi stisknout tlacitko) v milisekundach
    int ledTurnedOnDurationMillis;

    // cekani po zmene skore pri hre (aby si toho hrac stihl vsimnout) v milisekundach
    int waitAfterCounterChangeMillis;

    // mod, ktery se pouzije
    enum GameMode mode = MODE_REACH_FINAL_COUNT_CORRECT;

    // MODE_REACH_FINAL_COUNT_CORRECT: cilovy pocet spravnych stisknuti - je ignorovano pri tezsim modu dokud se hrac nesplete
    int finalCountCorrect;

    // MODE_REACH_FINAL_COUNT_CORRECT: maximalni povolena chybovost k dokonceni hry pri modu dosahnuti
    // poctu uspesnych stisknuti (napr. aby hrac nedrzel tlacitko stisknute neustale)
    // po prekroceni se pocty stisknuti vynuluji
    //   = pocet chybnych stisknuti / pocet spravnych stisknuti
    double maxErrorRateIndex;

    // MODE_UNTIL_MISTAKE_MODE: tolerovany pocet chyb hrace pri modu dokud se nesplete
    int mistakesCountTolerance;
};

extern PinSettings pinSettings;
extern GameSettings gameSettings;

#endif
