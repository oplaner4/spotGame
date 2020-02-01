var dataJSONhelper = function (dataJSON) {
    this.dataJSON = dataJSON;
    this.logAdditionalClasses = new Array();
};


dataJSONhelper.prototype.process = function (dataJSONmanager) {
    if (dataJSONmanager.eventTypesListeners.hasOwnProperty(dataJSON.eventType)) {
        dataJSONmanager.eventTypesListeners[dataJSON.eventType].forEach(function (callback) {
            var eventRetObj = callback(dataJSON);
            if (eventRetObj instanceof Object) {
                if (eventRetObj.hasOwnProperty('logAdditionalClasses')) {
                    if (this.logAdditionalClasses.indexOf(eventRetObj.logAdditionalClasses) === -1) {
                        this.logAdditionalClasses.push(eventRetObj.logAdditionalClasses);
                    }
                }
            }
        });
    }

    dataJSONmanager.eventNewDataListener(dataJSON, this.logAdditionalClasses);

    return this;
};

dataJSONhelper.prototype.getRemainsMistakesCountTolerance = function () {
    return this.dataJSON.mistakesCountTolerance - this.dataJSON.mistakesCounter > 0 ? this.dataJSON.mistakesCountTolerance - this.dataJSON.mistakesCounter : 0;
};

dataJSONhelper.prototype.getActualErrorRateIndex = function () {
    return this.dataJSON.correctCounter === 0 ? 0 : this.dataJSON.mistakesCounter / this.dataJSON.correctCounter;
};

dataJSONhelper.prototype.getRemainsFinalCountCorrect = function () {
    return this.dataJSON.finalCountCorrect - this.dataJSON.correctCounter;
};

dataJSONhelper.prototype.getGameModeName = function () {
    return this.dataJSON.gameMode;
};

dataJSONhelper.prototype.getCorrectCounter = function () {
    return this.dataJSON.correctCounter;
};

dataJSONhelper.prototype.getMistakesCounter = function () {
    return this.dataJSON.mistakesCounter;
};

dataJSONhelper.prototype.getMissedCounter = function () {
    return this.dataJSON.missedCounter;
};

dataJSONhelper.prototype.getData = function () {
    return this.dataJSON;
}