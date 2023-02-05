#include "SpotGame.Settings.h"
#include "SpotGame.State.h"

String constructJSONproperty (String key, String value, bool addSeparator = false) {
  return "\"" + key + "\":" + value + (addSeparator ? "," : "");
}

String constructJSONpropertyString (String key, String value, bool addSeparator = false) {
  return constructJSONproperty(key,"\"" + value + "\"", addSeparator);
}

String constructJSONpropertyInt (String key, int value, bool addSeparator = false) {
  return constructJSONproperty(key, String(value), addSeparator);
}

String constructJSONpropertyUnsignedLong (String key, unsigned long value, bool addSeparator = false) {
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

String gameModeToString (GameMode mode) {
    switch (mode) {
    case MODE_REACH_FINAL_COUNT_CORRECT:
        return "reachFinalCountCorrectMode";
        break;
    case MODE_UNTIL_MISTAKE:
        return "untilMistakeMode";
        break;
    default:
      return "unknown";
  }
}

void writeToSerialMonitor (String eventType, GameSettings settings, GameStateProps stateProps) { 
  // Data have to be sent as parts.
  
  Serial.println(
      // The first JSON describes how many parts are going to be sent.
      constructJSON (
        constructJSONpropertyInt ("JSONparts", 4, false)
      )
  );
  
  Serial.println(
      constructJSON (
         constructJSONpropertyString ("gameMode", gameModeToString(settings.mode), true) +
         constructJSONpropertyInt ("mistakesCountTolerance", settings.mistakesCountTolerance, true) +
         constructJSONpropertyInt ("finalCountCorrect", settings.finalCountCorrect, false)
      )
  );

  Serial.println(
      constructJSON (
         constructJSONpropertyInt ("correctCounter", stateProps.correctCounter, true) +
         constructJSONpropertyInt ("mistakesCounter", stateProps.mistakesCounter, true) +
         constructJSONpropertyInt ("missedCounter", stateProps.missedCounter, false)
      )
  );

  Serial.println(
      constructJSON (
         constructJSONpropertyUnsignedLong("correctDelayMillisCounter", stateProps.correctDelayMillisCounter, false)
      )
  );

  Serial.println(
      constructJSON (
        constructJSONpropertyInt ("ledTurnedOnDurationMillis", settings.ledTurnedOnDurationMillis, true) + 
        constructJSONpropertyDouble ("maxErrorRateIndex", settings.maxErrorRateIndex, true) +
        constructJSONpropertyString ("eventType", eventType, false)
      )
  );
}
