#ifndef SPOTGAME_SERIAL_H
#define SPOTGAME_SERIAL_H

#include "SpotGame.Settings.h"

/**
 * Constructs JSON property.
 * 
 * @param key: JSON key value.
 * @param value: JSON string value which can be accessed using key.
 * @param addSeparator: Add separator after property.
 * There should not be separator after last property.
 * @returns Constructed property.
 */
String constructJSONproperty (String key, String value, bool addSeparator = false);

/**
 * Constructs JSON property.
 * 
 * @param key: JSON key value.
 * @param value: JSON string value which can be accessed using key.
 * @param addSeparator: Add separator after property.
 * There should not be separator after last property.
 * @returns Constructed property.
 */
String constructJSONpropertyString (String key, String value, bool addSeparator = false);

/**
 * Constructs JSON property.
 * 
 * @param key: JSON key value.
 * @param value: JSON int value which can be accessed using key.
 * @param addSeparator: Add separator after property.
 * There should not be separator after last property.
 * @returns Constructed property.
 */
String constructJSONpropertyInt (String key, int value, bool addSeparator = false);

/**
 * Constructs JSON property.
 * 
 * @param key: JSON key value.
 * @param value: JSON unsigned long value which can be accessed using key.
 * @param addSeparator: Add separator after property.
 * There should not be separator after last property.
 * @returns Constructed property.
 */
String constructJSONpropertyUnsignedLong (String key, unsigned long value, bool addSeparator = false);

/**
 * Constructs JSON property.
 * 
 * @param key: JSON key value.
 * @param value: JSON double value which can be accessed using key.
 * @param addSeparator: Add separator after property.
 * There should not be separator after last property.
 * @returns Constructed property.
 */
String constructJSONpropertyDouble (String key, double value, bool addSeparator = false);

/**
 * Constructs JSON property.
 * 
 * @param key: JSON key value.
 * @param value: JSON bool value which can be accessed using key.
 * @param addSeparator: Add separator after property.
 * There should not be separator after last property.
 * @returns Constructed property.
 */
String constructJSONpropertyBool (String key, bool value, bool addSeparator = false);

/**
 * Constructs JSON from properties.
 * 
 * @param properties: Concatenated JSON properties.
 * @returns Constructed JSON data.
 */
String constructJSON (String properties);

/**
 * Converts game mode to the string which identifies that mode.
 * @param mode: Mode to convert.
 * @returns Representing string.
 */
String gameModeToString (GameMode mode);

/**
 * Writes progress / result information to the Serial monitor.
 *
 * @param eventType: Event type for machine processing.
 * @param settings: Used game settings instance.
 * @param stateProps: Actual game state props instance.
 */
void writeToSerialMonitor (String eventType, GameSettings settings, GameStateProps stateProps);

#endif