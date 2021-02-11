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

// cilovy pocet spravnych stisknuti - je ignorovano pri tezsim modu dokud se hrac nesplete
const int finalCountCorrect = 10;

// maximalni povolena chybovost k dokonceni hry pri modu dosahnuti
// poctu uspesnych stisknuti (napr. aby hrac nedrzel tlacitko stisknute neustale)
// po prekroceni se pocty stisknuti vynuluji
//   = pocet chybnych stisknuti / pocet spravnych stisknuti
const double maxErrorRateIndex = 5.0/(double)finalCountCorrect;

// hrat mod dosahnuti poctu uspesnych stisknuti
const bool reachFinalCountCorrectMode = true;

// hrat tezsi mod dokud se hrac nespete
// ignoruje cilovy pocet spravnych stisknuti
const bool untilMistakeMode = !reachFinalCountCorrectMode;

    // tolerovany pocet chyb hrace pri modu dokud se nesplete
    const int mistakesCountTolerance = 3;

// cekani po zmene skore pri hre (aby si toho hrac stihl vsimnout)
const int waitAfterGameUpdateState = 500;





// IMPLEMENTACE

// _____________________________________________________________________________________
// metody vyuzivajici nastaveni

int getRandomPauseMiliseconds () {
  return random(minPauseMiliseconds, maxPauseMiliseconds);
}


// _____________________________________________________________________________________
// globalni pomocne promene

unsigned long intervalRandomPauseElapsedMiliseconds = 0;
unsigned long intervalRandomPauseMiliseconds = getRandomPauseMiliseconds();

unsigned long intervalLedTurnedOnDurationElapsedMiliseconds = 0;


int correctCounter = 0;
int mistakesCounter = 0;
int missedCounter = 0;

bool ledBlinkingMode = false;

bool gameOver = false;
bool gameCompleted = false;

bool buttonPressedExecuteOnce = true;
bool gameDoneExecuteOnce = true;


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
  if (untilMistakeMode) {
    gameMode = "untilMistakeMode";
  }
  else if (reachFinalCountCorrectMode) {
    gameMode = "reachFinalCountCorrectMode";
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
         constructJSONpropertyInt ("correctCounter", correctCounter, true) +
         constructJSONpropertyInt ("mistakesCounter", mistakesCounter, true) +
         constructJSONpropertyInt ("missedCounter", missedCounter, false)
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
      if (gameOver) {
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
    return (double)mistakesCounter / (double)correctCounter > maxErrorRateIndex;
}


void onFinalCountCorrectReached() {
    // v modu dosahnuti poctu uspesnych stisknuti

    if (checkMaxErrorRateIndexExceed()) {
        // prekrocena chybovost, nelze ukoncit hru
        // vynulovani poctu spravnych, spatnych a zameskanych stisknuti
        mistakesCounter = 0;
        correctCounter = 0;
        missedCounter = 0;
        writeToSerialMonitor("Překročena maximální povolená chybovost", "maxErrorRateIndexExceed");
    }
    else {
        gameCompleted = true;
    }
}


void evalCorrect() {
    // zvyseni poctu uspesnych stisknuti
    correctCounter += 1;

    writeToSerialMonitor("Zvýšen počet správných stisknutí na: " + String(correctCounter) + (reachFinalCountCorrectMode ? (" z "+String(finalCountCorrect) + " cílových") : ""), "correctCountIncreased");

    if (reachFinalCountCorrectMode && correctCounter >= finalCountCorrect) {
        onFinalCountCorrectReached();
    }

    delay(waitAfterGameUpdateState);
}


void evalMistake() {
    digitalWrite(mistakeLedRed, HIGH);

    // zvyseni poctu chyb
    mistakesCounter += 1;

    writeToSerialMonitor("Zvýšen počet špatných stisknutí na: " + String(mistakesCounter) + (untilMistakeMode ? (" z " + String(mistakesCountTolerance) + " tolerovaných") : ""), "mistakesCountIncreased");

    if (untilMistakeMode && mistakesCounter > mistakesCountTolerance) {
        // mod dokud se hrac nesplete a presahnuti tolerance poctu chyb
        writeToSerialMonitor("Počet dosažených správných stisknutí: " + String(correctCounter), "correctCountReached");
        gameOver = true;
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

        if (buttonPressedExecuteOnce) {
            evalCorrect();
            buttonPressedExecuteOnce = !buttonPressedExecuteOnce;
        }
    }
}


void evalPauseMode() {
    // zhasnuti nahodne blikajici led a led signalizujici spravne stisknuti tlacitka
    digitalWrite(randomBlinkingLed, LOW);
    digitalWrite(correctLedGreen, LOW);

    if (digitalRead(pressButton) == HIGH) {
        // tlacitko se stisklo mezi bliknutimi = chyba
        if (buttonPressedExecuteOnce) {
            evalMistake();
            buttonPressedExecuteOnce = !buttonPressedExecuteOnce;
        }
    }
}


void evalOnMissed() {
    missedCounter += 1;

    if (untilMistakeMode) {
        // v modu dokud se hrac nesplete povazovano za chybu
        evalMistake();
    }
}


void setup() {
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

    if (gameOver || gameCompleted) {
        if (gameDoneExecuteOnce) {
            gameDone();
            gameDoneExecuteOnce = !gameDoneExecuteOnce;
        }
    }
    else if (ledBlinkingMode) {
        evalBlinkingMode();
        
        if (currentMillis - intervalLedTurnedOnDurationElapsedMiliseconds >= ledTurnedOnDurationMiliseconds) {
            // po ubehnuti doby zapnute led
            // deaktivace modu svitici led
            ledBlinkingMode = false;
        
            intervalRandomPauseElapsedMiliseconds = currentMillis;
            intervalLedTurnedOnDurationElapsedMiliseconds = currentMillis;

            if (buttonPressedExecuteOnce) {
                // zameskano stisknuti
                evalOnMissed();
            }
            
            buttonPressedExecuteOnce = true;
        }
    }
    else {
        evalPauseMode();

        if (currentMillis - intervalRandomPauseElapsedMiliseconds >= intervalRandomPauseMiliseconds) {
            // po ubehnuti intervalu mezi bliknutimi
            // aktivace doby rozsvicene led
            ledBlinkingMode = true;
        
            intervalRandomPauseElapsedMiliseconds = currentMillis;
            intervalLedTurnedOnDurationElapsedMiliseconds = currentMillis;

            // nova nahodna pristi pausa mezi rozsvicenimi led
            intervalRandomPauseMiliseconds = getRandomPauseMiliseconds();

            buttonPressedExecuteOnce = true;
        }
    }
}
