#include "SpotGame.h";


// Ondrej Planer, oplaner4@gmail.com, 10/2019
// SPOT GAME

// _____________________________________________________________________________________
// AKTUALIZACE

// 11/2019 - pridani maximalni povolene chybovosti
// 22/11/2019 - bugfix - correctCounter
// 9/12/2019 - debug, vypisovani na serial monitor
// 19/12/2019 - ad. serial monitor, dokud se neplete
// 17/1/2020 - ad. serial monitor, JSON podpora
// 23/1/2020 - JSON refactor
// 24/1/2020 - JSON String bugfix, String length bugfix
// 30/1/2020 - zameskana stisknuti
// 3/2/2020 - BUGFIX - maximalni povolena chybovost pretypovani
// 11/2/2021 - Refactor
// 27/1/2023 - Pouzit enum

// _____________________________________________________________________________________
// POPIS

// Cilem teto postrehove hry je spravne odhalovat moment, kdy je led rozsvicena stiskem tlacitka.
// Prvni rozsviceni nenastane drive nez je minimalni delka pausy mezi rozsvicenimi.
// 1. mod - cilem hry je dosahnout daneho poctu spravnych stisknuti v co nejkratsim case (hra konci vyhrou).
// 2. mod - cilem hry je hrat co nejdele, dokud se neprekroci pocet tolerovanych spatnych stisknuti (hra konci prohrou).
// nastaveni nize upravi obtiznost hry
// Jakmile hrac prohral nebo vyhral (dle modu), nahodne blikajici led se trvale nasviti a zelena/cervena led znazornuje vyhru/prohru


// _____________________________________________________________________________________
// VYBAVENÍ

// 3x LED - cervena, zelena a jina barva
// tlacitko


// _____________________________________________________________________________________
// NASTAVENÍ


// NEOBSAZUJTE PIN 0 A 1, PROGRAM BY NEFUNGOVAL SPRAVNE,
// TY JSOU URČENY PRO KOMUNIKACI SE SERIOVYM MONITOREM


// pin nahodne blikajici led
const int randomBlinkingLed = 6;

// pin led signalizujici chybu
const int mistakeLedRed = 4;

// pin led signalizujici uspesne stisknuti
const int correctLedGreen = 2;

// pin tlacitka, ktere se ma stisknout pri rozsviceni nahodne blikajici led
const int pressButton = 5;




// minimalni delka pausy mezi bliknutimi v milisekundach
const int minPauseMiliseconds = 800;

// maximalni delka pausy mezi bliknutimi v milisekundach
const int maxPauseMiliseconds = 3000;

// delka trvani rozsvicene led (behem teto doby se musi stisknout tlacitko) v milisekundach
const int ledTurnedOnDurationMiliseconds = 300;

// cekani po zmene skore pri hre (aby si toho hrac stihl vsimnout) v milisekundach
const int waitAfterGameUpdateState = 500;


// mod, ktery se pouzije
enum GameMode useGameMode = MODE_REACH_FINAL_COUNT_CORRECT;


// MODE_REACH_FINAL_COUNT_CORRECT: cilovy pocet spravnych stisknuti - je ignorovano pri tezsim modu dokud se hrac nesplete
const int finalCountCorrect = 10;

// MODE_REACH_FINAL_COUNT_CORRECT: maximalni povolena chybovost k dokonceni hry pri modu dosahnuti
// poctu uspesnych stisknuti (napr. aby hrac nedrzel tlacitko stisknute neustale)
// po prekroceni se pocty stisknuti vynuluji
//   = pocet chybnych stisknuti / pocet spravnych stisknuti
const double maxErrorRateIndex = 5.0/(double)finalCountCorrect;

// MODE_UNTIL_MISTAKE_MODE: tolerovany pocet chyb hrace pri modu dokud se nesplete
const int mistakesCountTolerance = 3;







// IMPLEMENTACE

// _____________________________________________________________________________________
// metody vyuzivajici nastaveni

int getRandomPauseMiliseconds () {
  return random(minPauseMiliseconds, maxPauseMiliseconds);
}

// _____________________________________________________________________________________
// metody pro serializaci dat do JSON

String constructJSONproperty (String key, String value, bool addSeparator = false) {
  return "\"" + key + "\":" + value + (addSeparator ? "," : "");
}

String constructJSONpropertyString (String key, String value, bool addSeparator = false) {
  return constructJSONproperty(key,"\"" + value + "\"", addSeparator);
}

String constructJSONpropertyInt (String key, int value, bool addSeparator = false) {
  return constructJSONproperty(key, String(value), addSeparator);
}

String constructJSONpropertyDouble (String key, double value, bool addSeparator = false) {
  return constructJSONproperty(key, String(value, 2), addSeparator);
}

String constructJSONpropertyBool (String key, bool value, bool addSeparator = false) {
  return constructJSONproperty (key, String(value), addSeparator);
}

String constructJSON (String properties) {
    return "{" + properties + "}";
}


// _____________________________________________________________________________________
// vypisujici metody

void writeToSerialMonitor (String message, String eventType = "") { 
  String gameMode = "";

  switch (useGameMode) {
    case MODE_REACH_FINAL_COUNT_CORRECT:
        gameMode = "reachFinalCountCorrectMode";
        break;
    case MODE_UNTIL_MISTAKE_MODE:
        gameMode = "untilMistakeMode";
        break;
  }

  // data je potreba posilat po castech! 300KB max.
  
  Serial.println(
      constructJSON (
        constructJSONpropertyInt ("JSONparts", 4, false)
      )
  );
  
  Serial.println(
      constructJSON (
         constructJSONpropertyString ("gameMode", gameMode, true) +
         constructJSONpropertyInt ("mistakesCountTolerance", mistakesCountTolerance, true) +
         constructJSONpropertyInt ("finalCountCorrect", finalCountCorrect, false)
      )
  );

  Serial.println(
      constructJSON (
         constructJSONpropertyInt ("correctCounter", useGameState.correctCounter, true) +
         constructJSONpropertyInt ("mistakesCounter", useGameState.mistakesCounter, true) +
         constructJSONpropertyInt ("missedCounter", useGameState.missedCounter, false)
      )
  );

  Serial.println(
      constructJSON (
        constructJSONpropertyInt ("ledTurnedOnDurationMiliseconds", ledTurnedOnDurationMiliseconds, true) + 
        constructJSONpropertyDouble ("maxErrorRateIndex", maxErrorRateIndex, true) +
        constructJSONpropertyString ("eventType", eventType, false)
      )
  );

  Serial.println(
      constructJSON (
        constructJSONpropertyString ("message", message, false)
      )
  );
}


void gameDone() {
      // trvale nasvicena led
      digitalWrite(randomBlinkingLed, HIGH);

      // potreba manualni RESET
      if (useGameState.gameOver) {
          // hra prohrana - nasviceni cervene led
          digitalWrite(mistakeLedRed, HIGH);
          writeToSerialMonitor ("Hra prohrána", "gameOver");
      }
      else {
          // hra dokoncena - nasviceni zelene led
          digitalWrite(correctLedGreen, HIGH);
          writeToSerialMonitor ("Hra dokončena", "gameCompleted");
      }
}


bool checkMaxErrorRateIndexExceed() {
    return (double)useGameState.mistakesCounter / (double)useGameState.correctCounter > maxErrorRateIndex;
}


void onFinalCountCorrectReached() {
    // v modu dosahnuti poctu uspesnych stisknuti

    if (checkMaxErrorRateIndexExceed()) {
        // prekrocena chybovost, nelze ukoncit hru
        // vynulovani poctu spravnych, spatnych a zameskanych stisknuti
        useGameState.mistakesCounter = 0;
        useGameState.correctCounter = 0;
        useGameState.missedCounter = 0;
        writeToSerialMonitor("Překročena maximální povolená chybovost", "maxErrorRateIndexExceed");
    }
    else {
        useGameState.gameCompleted = true;
    }
}


void evalCorrect() {
    // zvyseni poctu uspesnych stisknuti
    useGameState.correctCounter += 1;

    writeToSerialMonitor("Zvýšen počet správných stisknutí na: " + String(useGameState.correctCounter) + (useGameMode == MODE_REACH_FINAL_COUNT_CORRECT ? (" z "+String(finalCountCorrect) + " cílových") : ""), "correctCountIncreased");

    if (useGameMode == MODE_REACH_FINAL_COUNT_CORRECT && useGameState.correctCounter >= finalCountCorrect) {
        onFinalCountCorrectReached();
    }

    delay(waitAfterGameUpdateState);
}


void evalMistake() {
    digitalWrite(mistakeLedRed, HIGH);

    // zvyseni poctu chyb
    useGameState.mistakesCounter += 1;

    writeToSerialMonitor("Zvýšen počet špatných stisknutí na: " + String(useGameState.mistakesCounter) + (useGameMode == MODE_UNTIL_MISTAKE_MODE ? (" z " + String(mistakesCountTolerance) + " tolerovaných") : ""), "mistakesCountIncreased");

    if (useGameMode == MODE_UNTIL_MISTAKE_MODE && useGameState.mistakesCounter > mistakesCountTolerance) {
        // mod dokud se hrac nesplete a presahnuti tolerance poctu chyb
        writeToSerialMonitor("Počet dosažených správných stisknutí: " + String(useGameState.correctCounter), "correctCountReached");
        useGameState.gameOver = true;
    }

    delay(waitAfterGameUpdateState);
}


void evalBlinkingMode() {
    // rozsviceni led, ocekavani stisku tlacitka
    digitalWrite(randomBlinkingLed, HIGH);
    
    // zhasnuti led signalizujici chybu
    digitalWrite(mistakeLedRed, LOW);
  
    if (digitalRead(pressButton) == HIGH) {
        // tlacitko bylo stisknuto - zapnuti led signalizujici uspesne stisknuti
        digitalWrite(correctLedGreen, HIGH);

        if (useGameState.buttonPressedExecuteOnce) {
            evalCorrect();
            useGameState.buttonPressedExecuteOnce = !useGameState.buttonPressedExecuteOnce;
        }
    }
}


void evalPauseMode() {
    // zhasnuti nahodne blikajici led a led signalizujici spravne stisknuti tlacitka
    digitalWrite(randomBlinkingLed, LOW);
    digitalWrite(correctLedGreen, LOW);

    if (digitalRead(pressButton) == HIGH) {
        // tlacitko se stisklo mezi bliknutimi = chyba
        if (useGameState.buttonPressedExecuteOnce) {
            evalMistake();
            useGameState.buttonPressedExecuteOnce = !useGameState.buttonPressedExecuteOnce;
        }
    }
}


void evalOnMissed() {
    useGameState.missedCounter += 1;

    if (useGameMode == MODE_UNTIL_MISTAKE_MODE) {
        // v modu dokud se hrac nesplete povazovano za chybu
        evalMistake();
    }
}


void setup() {
    useGameState.intervalRandomPauseElapsedMiliseconds = 0;
    useGameState.intervalRandomPauseElapsedMiliseconds = 0;
    useGameState.intervalRandomPauseMiliseconds = getRandomPauseMiliseconds();
    useGameState.intervalLedTurnedOnDurationElapsedMiliseconds = 0;
    useGameState.correctCounter = 0;
    useGameState.mistakesCounter = 0;
    useGameState.missedCounter = 0;
    useGameState.ledBlinkingMode = false;
    useGameState.gameOver = false;
    useGameState.gameCompleted = false;
    useGameState.buttonPressedExecuteOnce = true;
    useGameState.gameDoneExecuteOnce = true;

    pinMode(randomBlinkingLed, OUTPUT);
    pinMode(mistakeLedRed, OUTPUT);
    pinMode(correctLedGreen, OUTPUT);

    pinMode(pressButton, INPUT);

    Serial.begin(9600);
    writeToSerialMonitor("Arduino deska úspěšně resetována", "arduinoBoardReseted");
    writeToSerialMonitor("Hra spuštěna", "gameInitialized");
}


void loop() {
    unsigned long currentMillis = millis();

    if (useGameState.gameOver || useGameState.gameCompleted) {
        if (useGameState.gameDoneExecuteOnce) {
            gameDone();
            useGameState.gameDoneExecuteOnce = !useGameState.gameDoneExecuteOnce;
        }
    }
    else if (useGameState.ledBlinkingMode) {
        evalBlinkingMode();
        
        if (currentMillis - useGameState.intervalLedTurnedOnDurationElapsedMiliseconds >= ledTurnedOnDurationMiliseconds) {
            // po ubehnuti doby zapnute led
            // deaktivace modu svitici led
            useGameState.ledBlinkingMode = false;
        
            useGameState.intervalRandomPauseElapsedMiliseconds = currentMillis;
            useGameState.intervalLedTurnedOnDurationElapsedMiliseconds = currentMillis;

            if (useGameState.buttonPressedExecuteOnce) {
                // zameskano stisknuti
                evalOnMissed();
            }
            
            useGameState.buttonPressedExecuteOnce = true;
        }
    }
    else {
        evalPauseMode();

        if (currentMillis - useGameState.intervalRandomPauseElapsedMiliseconds >= useGameState.intervalRandomPauseMiliseconds) {
            // po ubehnuti intervalu mezi bliknutimi
            // aktivace doby rozsvicene led
            useGameState.ledBlinkingMode = true;
        
            useGameState.intervalRandomPauseElapsedMiliseconds = currentMillis;
            useGameState.intervalLedTurnedOnDurationElapsedMiliseconds = currentMillis;

            // nova nahodna pristi pausa mezi rozsvicenimi led
            useGameState.intervalRandomPauseMiliseconds = getRandomPauseMiliseconds();

            useGameState.buttonPressedExecuteOnce = true;
        }
    }
}
