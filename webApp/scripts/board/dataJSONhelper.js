var dataJSONhelper = function (dataJSON) {
    this.dataJSON = dataJSON;
    this.logAdditionalClasses = new Array();
};


dataJSONhelper.prototype.process = function (dataJSONmanager) {
    var self = this;

    dataJSONmanager.getEventTypeListeners(self.getData().eventType).concat(
        dataJSONmanager.getEventTypeListeners('newDataJSON')
    ).forEach(function (callback) {
        var eventRetObj = callback(self);
        if (eventRetObj instanceof Object) {
            if (eventRetObj.hasOwnProperty('logAdditionalClasses')) {
                if (self.logAdditionalClasses.indexOf(eventRetObj.logAdditionalClasses) === -1) {
                    self.logAdditionalClasses.push(eventRetObj.logAdditionalClasses);
                }
            }
        }
    });

    return this;
};

dataJSONhelper.prototype.getRemainsMistakesCountTolerance = function () {
    return this.getData().mistakesCountTolerance - this.getData().mistakesCounter > 0 ? this.getData().mistakesCountTolerance - this.getData().mistakesCounter : 0;
};

dataJSONhelper.prototype.getActualErrorRateIndex = function () {
    return this.getData().correctCounter === 0 ? 0 : this.getData().mistakesCounter / this.getData().correctCounter;
};

dataJSONhelper.prototype.getRemainsFinalCountCorrect = function () {
    return this.getData().finalCountCorrect - this.getData().correctCounter;
};

dataJSONhelper.prototype.getGameModeName = function () {
    return this.getData().gameMode;
};

dataJSONhelper.prototype.getCorrectCounter = function () {
    return this.getData().correctCounter;
};

dataJSONhelper.prototype.getMistakesCounter = function () {
    return this.getData().mistakesCounter;
};

dataJSONhelper.prototype.getMissedCounter = function () {
    return this.getData().missedCounter;
};

dataJSONhelper.prototype.getMessage = function () {
    return this.getData().message;
};

dataJSONhelper.prototype.getData = function () {
    return this.dataJSON;
};