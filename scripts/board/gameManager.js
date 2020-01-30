var gameManager = function (dataJSONmanagerInstance, dataJSONconsoleManagerInstance) {
    this.dataJSONmanagerInstance = dataJSONmanagerInstance;
    this.dataJSONconsoleManagerInstance = dataJSONconsoleManagerInstance;

    this.initialized = false;
    this.ended = false;

    this.actualTimeElapsedInterval = null;
    this.initializedMoment = null;

    this.modesAndTitles = new Object({
        untilMistakeMode: "Dokud se hráč nesplete",
        reachFinalCountCorrectMode: "Cílový počet správných stisknutí"
    });
    this.actualTimeElapsed = '00:00:00';
};

gameManager.prototype.getModeTitle = function (dataJSON) {
    return this.modesAndTitles[dataJSON.gameMode];
};

gameManager.prototype.savePlayerData = function (finalDataJSON) {
    var self = this;
    if (self.initialized && self.ended) {
        $.ajax({
            url: "/board/save",
            method: "POST",
            dataType: "text",
            data: {
                gameMode: self.getModeTitle(finalDataJSON),
                correctCounter: finalDataJSON.correctCounter,
                mistakesCounter: finalDataJSON.mistakesCounter,
                missedCounter: finalDataJSON.missedCounter,
                ledTurnedOnDurationMiliseconds: finalDataJSON.ledTurnedOnDurationMiliseconds,
                mistakesCountTolerance: finalDataJSON.mistakesCountTolerance,
                finalCountCorrect: finalDataJSON.finalCountCorrect,
                gameTimeElapsed: self.actualTimeElapsed
            },
            success: function (data) {
                self.dataJSONconsoleManagerInstance.prependNewLog(data, 'list-group-item-info');
            },
            error: function (data) {
                console.log(data);
            }
        });
    }
    else {
        self.dataJSONconsoleManagerInstance.prependNewLog('Deska nebyla správně resetována', 'list-group-item-danger');
    }

    return self;
};

gameManager.prototype.initActualTimeElapsed = function () {
    var self = this;
    self.initializedMoment = new moment();
    self.actualTimeElapsedInterval = setInterval(function () {
        self.actualTimeElapsed = moment.utc(new moment().diff(self.initializedMoment)).format(standardTimeFormat);
        self.dataJSONmanagerInstance.updateElemChangingValue('listGroupItemActualGameTimeElapsed', self.actualTimeElapsed);
    }, 1000);

    return self;
};

gameManager.prototype.stopActualTimeElapsed = function () {
    clearInterval(this.actualTimeElapsedInterval);
    return this;
};

gameManager.prototype.adjustOutputElemsToGameMode = function (initializedDataJSON) {
    var elemDataTargetMode = 'data-target-mode';
    $('[' + elemDataTargetMode + ']').css('display', 'none').filter('[' + elemDataTargetMode + '="' + initializedDataJSON.gameMode + '"]').attr('style', '');
    this.dataJSONmanagerInstance.updateElemChangingValue('listGroupItemGameModeTitle', this.getModeTitle(initializedDataJSON));

    return this;
};

gameManager.prototype.initialize = function (initializedDataJSON) {
    this.initialized = true;
    this.ended = false;
    this.initActualTimeElapsed();
    this.adjustOutputElemsToGameMode(initializedDataJSON);
    this.dataJSONconsoleManagerInstance.empty().prependNewLog('Arduino deska resetována', 'list-group-item-success');
    this.dataJSONmanagerInstance
        .updateElemChangingValue('listGroupItemLedTurnedOnDurationMiliseconds', initializedDataJSON.ledTurnedOnDurationMiliseconds)
        .updateElemChangingValue('listGroupItemMaxErrorRateIndex', initializedDataJSON.maxErrorRateIndex.toFixed(2))
        .updateElemChangingValue('listGroupItemMistakesCountTolerance', initializedDataJSON.mistakesCountTolerance)
        .updateElemChangingValue('listGroupItemFinalCountCorrect', initializedDataJSON.finalCountCorrect);


    return this;
};

gameManager.prototype.end = function () {
    if (this.initialized) {
        this.ended = true;
        this.stopActualTimeElapsed();
    }

    this.dataJSONmanagerInstance.stopCheckForNewData();
    this.dataJSONconsoleManagerInstance.fadeOutUpdating();

    return this;
};

gameManager.prototype.start = function () {
    this.ended = false;
    this.dataJSONmanagerInstance.outputElemsSetDefaults().startCheckForNewData();
    this.dataJSONconsoleManagerInstance.fadeInUpdating().empty().prependNewLog('Čekání na manuální resetování Arduino desky', 'list-group-item-danger');
    return this;
};

gameManager.prototype.reset = function () {
    var self = this;
    self.end();

    $.ajax({
        url: "/board/reset",
        dataType: "text",
        success: function () {
            self.start();
        },
        error: function (data) {
            console.log(data);
        }
    });

    return self;
};

gameManager.prototype.update = function (dataJSON, logAdditionalClasses) {
    if (this.initialized || this.ended) {
        this.dataJSONconsoleManagerInstance.prependNewLog(dataJSON.message, logAdditionalClasses.join(' '));
        this.dataJSONmanagerInstance.updateElemChangingValue('listGroupItemCorrectCounter', dataJSON.correctCounter);
        this.dataJSONmanagerInstance.updateElemChangingValue('listGroupItemMistakesCounter', dataJSON.mistakesCounter);
        this.dataJSONmanagerInstance.updateElemChangingValue('listGroupItemRemainsMistakesCountTolerance', dataJSON.mistakesCountTolerance - dataJSON.mistakesCounter > 0 ? dataJSON.mistakesCountTolerance - dataJSON.mistakesCounter : 0);
        this.dataJSONmanagerInstance.updateElemChangingValue('listGroupItemRemainsFinalCountCorrect', dataJSON.finalCountCorrect - dataJSON.correctCounter);
        this.dataJSONmanagerInstance.updateElemChangingValue('listGroupItemActualErrorRateIndex', new Number(dataJSON.correctCounter === 0 ? 0 : dataJSON.mistakesCounter / dataJSON.correctCounter).toFixed(2));
        this.dataJSONmanagerInstance.updateElemChangingValue('listGroupItemMissedCounter', dataJSON.missedCounter);
    }

    return this;
};