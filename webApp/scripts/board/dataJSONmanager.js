var dataJSONmanager = function (updateIntervalMiliseconds) {
    this.updateIntervalMiliseconds = updateIntervalMiliseconds;
    this.countAnalyzed = 0;
    this.eventTypesListeners = new Object();
    this.eventNewDataListener = function () { };

    this.outputElems = new Object({
        listGroupItemMistakesCountTolerance: $('.list-group-item-mistakesCountTolerance'),
        listGroupItemMaxErrorRateIndex: $('.list-group-item-maxErrorRateIndex'),
        listGroupItemFinalCountCorrect: $('.list-group-item-finalCountCorrect'),
        listGroupItemLedTurnedOnDurationMiliseconds: $('.list-group-item-ledTurnedOnDurationMiliseconds'),
        listGroupItemGameModeTitle: $('.list-group-item-gameModeTitle'),
        listGroupItemCorrectCounter: $('.list-group-item-correctCounter'),
        listGroupItemMistakesCounter: $('.list-group-item-mistakesCounter'),
        listGroupItemRemainsMistakesCountTolerance: $('.list-group-item-remainsMistakesCountTolerance'),
        listGroupItemRemainsFinalCountCorrect: $('.list-group-item-remainsFinalCountCorrect'),
        listGroupItemActualErrorRateIndex: $('.list-group-item-actualErrorRateIndex'),
        listGroupItemActualGameTimeElapsed: $('.list-group-item-actualGameTimeElapsed'),
        listGroupItemMissedCounter: $('.list-group-item-missedCounter')
    });

    this.outputElemsDefaults = new Object({
        listGroupItemMistakesCountTolerance: '0',
        listGroupItemMaxErrorRateIndex: '0',
        listGroupItemFinalCountCorrect: '0',
        listGroupItemLedTurnedOnDurationMiliseconds: '0',
        listGroupItemGameModeTitle: 'Zatím nenastaven',
        listGroupItemCorrectCounter: '0',
        listGroupItemMistakesCounter: '0',
        listGroupItemRemainsMistakesCountTolerance: '0',
        listGroupItemRemainsFinalCountCorrect: '0',
        listGroupItemActualErrorRateIndex: '0',
        listGroupItemActualGameTimeElapsed: '00:00:00',
        listGroupItemMissedCounter: '0'
    });

    this.checkForNewMultipleInterval = null;
};

dataJSONmanager.prototype.startCheckForNewData = function () {
    var self = this;
    self.countAnalyzed = 0;
    self.checkForNewMultipleInterval = setInterval(function () {
        self.checkForNewMultiple();
    }, self.updateIntervalMiliseconds);

    self.checkForNewMultiple();

    return self;
};

dataJSONmanager.prototype.updateElemChangingValue = function (outputElemName, value) {
    $('span', this.getOutputElem(outputElemName)).first().text(value);

    return this;
};

dataJSONmanager.prototype.checkForNewMultiple = function () {
    var self = this;
    $.ajax({
        url: "/board/data",
        method: "GET",
        dataType: "json",
        data: {
            skipMultipleDataJSON: self.countAnalyzed
        },
        success: function (multipleDataJSON) {
            multipleDataJSON.forEach(function (dataJSON) {
                new dataJSONhelper(dataJSON).process(self);
            });

            self.countAnalyzed += multipleDataJSON.length;
        }
    });

    return self;
};

dataJSONmanager.prototype.stopCheckForNewData = function () {
    clearInterval(this.checkForNewMultipleInterval);
    return this;
};

dataJSONmanager.prototype.outputElemsSetDefaults = function () {
    for (var elemName in this.outputElems) {
        this.updateElemChangingValue(elemName, this.outputElemsDefaults[elemName]);
    }

    return this;
};

dataJSONmanager.prototype.getOutputElem = function (outputElemName) {
    return this.outputElems[outputElemName];
};

dataJSONmanager.prototype.addEventTypesListener = function (eventTypes, callback) {
    var self = this;
    eventTypes.split(/\s+/).forEach(function (eventType) {
        self.getEventTypeListeners(eventType).push(callback);
    });
    return self;
};

dataJSONmanager.prototype.getEventTypeListeners = function (eventTypeName) {
    if (!this.eventTypesListeners.hasOwnProperty(eventTypeName)) {
        this.eventTypesListeners[eventTypeName] = new Array();
    }

    return this.eventTypesListeners[eventTypeName];
};

