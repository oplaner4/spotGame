var gameManager = function (dataJSONmanagerInstance, dataJSONconsoleManagerInstance) {
    this.dataJSONmanagerInstance = dataJSONmanagerInstance;
    this.dataJSONconsoleManagerInstance = dataJSONconsoleManagerInstance;

    this.initialized = false;
    this.ended = false;

    this.actualTimeElapsedInterval = null;
    this.startedUnixTimestamp = 0;
};


gameManager.prototype.getDataJSONmanager = function () {
    return this.dataJSONmanagerInstance;
};

gameManager.prototype.getDataJSONConsoleManager = function () {
    return this.dataJSONconsoleManagerInstance;
};

gameManager.prototype.savePlayerData = function (dataJSONhelper) {
    let self = this;
    if (self.initialized && self.ended) {
        $.ajax({
            url: "/board/save",
            method: "POST",
            dataType: "text",
            data: {
                gameMode: dataJSONhelper.getGameModeName(),
                correctCounter: dataJSONhelper.getCorrectCounter(),
                mistakesCounter: dataJSONhelper.getMistakesCounter(),
                missedCounter: dataJSONhelper.getMissedCounter(),
                correctDelayMillisCounter: dataJSONhelper.getCorrectDelayMillisCounter(),
                totalTimeMillis: new Date().getTime() - self.startedUnixTimestamp,
            },
            success: function () {
                self.getDataJSONConsoleManager().prependNewLog('gameResultsSaved', 'list-group-item-info');
            },
            error: function () {
                self.getDataJSONConsoleManager().prependNewLog('unableToSaveResults', 'list-group-item-danger');
            }
        });
    }
    else {
        self.getDataJSONConsoleManager().prependNewLog('arduinoBoardInvalidReset', 'list-group-item-danger');
    }

    return self;
};

gameManager.prototype.initActualTimeElapsed = function () {
    let self = this;
    self.startedUnixTimestamp = new Date().getTime();

    self.actualTimeElapsedInterval = setInterval(function () {
        self.getDataJSONmanager().updateElemChangingValue('listGroupItemActualGameTimeElapsed',
            moment.utc(new Date().getTime() - self.startedUnixTimestamp).format(standardTimeFormat));
    }, 1000);

    return self;
};

gameManager.prototype.stopActualTimeElapsed = function () {
    clearInterval(this.actualTimeElapsedInterval);
    return this;
};

gameManager.prototype.adjustOutputElemsToGameMode = function (dataJSONhelper) {
    let elemDataTargetMode = 'data-target-mode';
    $('[' + elemDataTargetMode + ']').css('display', 'none').filter('[' + elemDataTargetMode + '="' + dataJSONhelper.getGameModeName() + '"]').attr('style', '');
    this.getDataJSONmanager().updateElemChangingValue('listGroupItemGameModeTitle', getModeTitle(dataJSONhelper.getGameModeName()));

    return this;
};

gameManager.prototype.initialize = function (dataJSONhelper) {
    this.initialized = true;
    this.ended = false;
    this.adjustOutputElemsToGameMode(dataJSONhelper);
    this.initializeConsole();
    this.getDataJSONmanager()
        .updateElemChangingValue('listGroupItemLedTurnedOnDurationMillis', dataJSONhelper.getData().ledTurnedOnDurationMillis)
        .updateElemChangingValue('listGroupItemMaxErrorRateIndex', dataJSONhelper.getData().maxErrorRateIndex.toFixed(2))
        .updateElemChangingValue('listGroupItemMistakesCountTolerance', dataJSONhelper.getData().mistakesCountTolerance)
        .updateElemChangingValue('listGroupItemFinalCountCorrect', dataJSONhelper.getData().finalCountCorrect);


    return this;
};

gameManager.prototype.end = function () {
    if (this.initialized) {
        this.ended = true;
        this.stopActualTimeElapsed();
    }

    this.getDataJSONmanager().stopCheckForNewData();
    this.getDataJSONConsoleManager().fadeOutUpdating();

    return this;
};

gameManager.prototype.initializeConsole = function () {
    return this.getDataJSONConsoleManager().fadeInUpdating().empty();
};

gameManager.prototype.start = function () {
    this.ended = false;
    this.initialized = false;
    this.initializeConsole().prependNewLog('waitingForArduinoBoardReset', 'list-group-item-danger');
    this.getDataJSONmanager().outputElemsSetDefaults().startCheckForNewData();
    return this;
};

gameManager.prototype.reset = function () {
    let self = this;
    self.end().getDataJSONmanager().reset();

    $.ajax({
        url: "/board/reset",
        dataType: "text",
        success: function () {
            self.start();
        }
    });

    return self;
};

gameManager.prototype.update = function (dataJSONhelper) {
    if (!this.initialized || this.ended) {
        return this;
    }

    this.getDataJSONConsoleManager().prependNewLog(dataJSONhelper.getData().eventType, dataJSONhelper.logAdditionalClasses);
    this.getDataJSONmanager()
        .updateElemChangingValue('listGroupItemCorrectCounter', dataJSONhelper.getCorrectCounter())
        .updateElemChangingValue('listGroupItemMistakesCounter', dataJSONhelper.getMistakesCounter())
        .updateElemChangingValue('listGroupItemRemainsMistakesCountTolerance', dataJSONhelper.getRemainsMistakesCountTolerance())
        .updateElemChangingValue('listGroupItemRemainsFinalCountCorrect', dataJSONhelper.getRemainsFinalCountCorrect())
        .updateElemChangingValue('listGroupItemActualErrorRateIndex', dataJSONhelper.getActualErrorRateIndex().toFixed(2))
        .updateElemChangingValue('listGroupItemMissedCounter', dataJSONhelper.getMissedCounter());

    return this;
};