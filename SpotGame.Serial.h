#ifndef SPOTGAME_SERIAL_H
#define SPOTGAME_SERIAL_H

#include "SpotGame.Settings.h"

String constructJSONproperty (String key, String value, bool addSeparator = false);
String constructJSONpropertyString (String key, String value, bool addSeparator = false);
String constructJSONpropertyInt (String key, int value, bool addSeparator = false);
String constructJSONpropertyUnsignedLong (String key, unsigned long value, bool addSeparator = false);
String constructJSONpropertyDouble (String key, double value, bool addSeparator = false);
String constructJSONpropertyBool (String key, bool value, bool addSeparator = false);
String constructJSON (String properties);
String gameModeToString (GameMode mode);
void writeToSerialMonitor (String message, String eventType, GameSettings settings, GameStateProps stateProps);

#endif