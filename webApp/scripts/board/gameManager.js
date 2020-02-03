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


gameManager.prototype.getDataJSONmanager = function () {
    return this.dataJSONmanagerInstance;
};

gameManager.prototype.getDataJSONConsoleManager = function () {
    return this.dataJSONconsoleManagerInstance;
};

gameManager.prototype.getModeTitle = function (dataJSONhelper) {
    return this.modesAndTitles[dataJSONhelper.getGameModeName()];
};

gameManager.prototype.savePlayerData = function (dataJSONhelper) {
    var self = this;
    if (self.initialized && self.ended) {
        $.ajax({
            url: "/board/save",
            method: "POST",
            dataType: "text",
            data: {
                gameMode: self.getModeTitle(dataJSONhelper),
                gameTimeElapsed: self.actualTimeElapsed,
                correctCounter: dataJSONhelper.getCorrectCounter(),
                mistakesCounter: dataJSONhelper.getMistakesCounter(),
                missedCounter: dataJSONhelper.getMissedCounter()
            },
            success: function (data) {
                self.getDataJSONConsoleManager().prependNewLog(data, 'list-group-item-info');
            },
            error: function (data) {
                console.log(data);
            }
        });
    }
    else {
        self.getDataJSONConsoleManager().prependNewLog('Deska nebyla správně resetována', 'list-group-item-danger');
    }

    return self;
};

gameManager.prototype.initActualTimeElapsed = function () {
    var self = this;
    self.initializedMoment = new moment();
    self.actualTimeElapsedInterval = setInterval(function () {
        self.actualTimeElapsed = moment.utc(new moment().diff(self.initializedMoment)).format(standardTimeFormat);
        self.getDataJSONmanager().updateElemChangingValue('listGroupItemActualGameTimeElapsed', self.actualTimeElapsed);
    }, 1000);

    return self;
};

gameManager.prototype.stopActualTimeElapsed = function () {
    clearInterval(this.actualTimeElapsedInterval);
    return this;
};

gameManager.prototype.adjustOutputElemsToGameMode = function (dataJSONhelper) {
    var elemDataTargetMode = 'data-target-mode';
    $('[' + elemDataTargetMode + ']').css('display', 'none').filter('[' + elemDataTargetMode + '="' + dataJSONhelper.getGameModeName() + '"]').attr('style', '');
    this.getDataJSONmanager().updateElemChangingValue('listGroupItemGameModeTitle', this.getModeTitle(dataJSONhelper));

    return this;
};

gameManager.prototype.initialize = function (dataJSONhelper) {
    this.initialized = true;
    this.ended = false;
    this.adjustOutputElemsToGameMode(dataJSONhelper);
    this.initializeConsole();
    this.getDataJSONmanager()
        .updateElemChangingValue('listGroupItemLedTurnedOnDurationMiliseconds', dataJSONhelper.getData().ledTurnedOnDurationMiliseconds)
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
    this.initializeConsole().prependNewLog('Čekání na manuální resetování Arduino desky', 'list-group-item-danger');
    this.getDataJSONmanager().outputElemsSetDefaults().startCheckForNewData();
    return this;
};

gameManager.prototype.reset = function () {
    var self = this;
    self.end();

    $.ajax({
        url: "/board/reset",
        dataType: "text",
        success: function (data) {
            console.log(data);
            self.start();
        },
        error: function (data) {
            console.log(data);
        }
    });

    return self;
};

gameManager.prototype.update = function (dataJSONhelper) {
    if (this.initialized || this.ended) {
        this.getDataJSONConsoleManager().prependNewLog(dataJSONhelper.getData().message, dataJSONhelper.logAdditionalClasses);
        this.getDataJSONmanager()
            .updateElemChangingValue('listGroupItemCorrectCounter', dataJSONhelper.getCorrectCounter())
            .updateElemChangingValue('listGroupItemMistakesCounter', dataJSONhelper.getMistakesCounter())
            .updateElemChangingValue('listGroupItemRemainsMistakesCountTolerance', dataJSONhelper.getRemainsMistakesCountTolerance())
            .updateElemChangingValue('listGroupItemRemainsFinalCountCorrect', dataJSONhelper.getRemainsFinalCountCorrect())
            .updateElemChangingValue('listGroupItemActualErrorRateIndex', dataJSONhelper.getActualErrorRateIndex().toFixed(2))
            .updateElemChangingValue('listGroupItemMissedCounter', dataJSONhelper.getMissedCounter());
    }

    return this;
};