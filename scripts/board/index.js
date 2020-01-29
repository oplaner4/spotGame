var gameManager = function (dataJSONmanagerInstance) {
    this.dataJSONmanagerInstance = dataJSONmanagerInstance;
    this.initialized = false;
    this.actualTimeElapsedInterval = null;
    this.initializedMoment = null;
    this.modesAndTitles = new Object({
        untilMistakeMode: "Dokud se hráč nesplete",
        reachFinalCountCorrectMode: "Cílový počet správných stisknutí"
    });
    this.actualTimeElapsed = '00:00:00';


};

gameManager.prototype.savePlayerData = function (finalDataJSON) {
    $.ajax({
        url: "/board/save",
        method: "POST",
        dataType: "text",
        data: {
            gameMode: gameProperties.modesAndTitles[finalDataJSON.gameMode],
            correctCounter: finalDataJSON.correctCounter,
            mistakesCounter: finalDataJSON.mistakesCounter,
            ledTurnedOnDurationMiliseconds: finalDataJSON.ledTurnedOnDurationMiliseconds,
            mistakesCountTolerance: finalDataJSON.mistakesCountTolerance,
            finalCountCorrect: finalDataJSON.finalCountCorrect,
            gameTimeElapsed: gameProperties.actualTimeElapsed
        },
        success: function (data) {
            spotGameDataJSONconsoleManager.prependNewLog(data, 'list-group-item-info');
        },
        error: function (data) {
            console.log(data);
        }
    });

    return this;
};



var dataJSONmanager = function (updateIntervalMiliseconds) {
    this.updateIntervalMiliseconds = updateIntervalMiliseconds;
    this.countAnalyzed = 0;
    this.eventTypesListeners = new Object();

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
        btnGameReset: $('.btn-game-reset')
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
        btnGameReset: 'Resetovat hru'
    });

    this.checkForNewMultipleInterval = setInterval(function () {
        this.checkForNewMultiple();
    }, updateIntervalMiliseconds);

    this.checkForNewMultiple();
};

dataJSONmanager.prototype.addEventTypesListener = function (eventTypes, callback) {
    eventTypes.split(/\s+/).forEach(function (eventType) {
        if (!Array.isArray(this.eventTypesListeners[eventType])) {
            this.eventTypesListeners[eventType] = new Array();
        }

        this.eventTypesListeners[eventType].push(callback);
    });

    return this;
};

dataJSONmanager.prototype.updateElemChangingValue = function (outputElemName, value) {
    $('span', this.outputElems[outputElemName]).first().text(value);

    return this;
};

dataJSONmanager.prototype.processing = function (dataJSON) {
    var logAdditionalClasses = new Array();

    if (dataJSONeventTypesListeners.hasOwnProperty(dataJSON.eventType)) {
        dataJSONeventTypesListeners[dataJSON.eventType].forEach(function (callback) {
            var eventRetObj = callback(dataJSON);
            if (eventRetObj instanceof Object) {
                logAdditionalClasses.push(eventRetObj.logAdditionalClasses);
            }
        });
    }

    if (gameProperties.initialized) {
        spotGameDataJSONconsoleManager.prependNewLog(dataJSON.message, logAdditionalClasses.join(' '));

        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemCorrectCounter, dataJSON.correctCounter);
        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemMistakesCounter, dataJSON.mistakesCounter);
        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemRemainsMistakesCountTolerance, dataJSON.mistakesCountTolerance - dataJSON.mistakesCounter > 0 ? dataJSON.mistakesCountTolerance - dataJSON.mistakesCounter : 0);
        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemRemainsFinalCountCorrect, dataJSON.finalCountCorrect - dataJSON.correctCounter);
        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemActualErrorRateIndex, new Number(dataJSON.correctCounter === 0 ? 0 : dataJSON.mistakesCounter / dataJSON.correctCounter).toFixed(2));
    }

    return this;
};

dataJSONmanager.prototype.processingMultiple = function (multipleDataJSON) {
    multipleDataJSON.forEach(function (dataJSON) {
        processingDataJSON(dataJSON);
    });

    return this;
};

dataJSONmanager.prototype.checkForNewMultiple = function () {
    $.ajax({
        url: "/board/data",
        method: "GET",
        dataType: "json",
        data: {
            skipMultipleDataJSON: this.countAnalyzed
        },
        success: function (multipleDataJSON) {
            this.processingMultiple(multipleDataJSON);
            this.countAnalyzed += multipleDataJSON.length;
        }
    });

    return this;
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






var dataJSONconsoleManager = function () {
    this.listGroupConsole = $('.list-group.list-group-item-console');
    this.listGroupItemConsoleLogTemplate = $('.list-group-item-log-template', this.listGroupConsole).detach().removeClass('d-none list-group-item-log-template');
    this.iConsoleUpdating = $('i.fa-console-updating');
};

dataJSONconsoleManager.prototype.prependNewLog = function (message, additionalClasses) {
    var newListGroupItemLog = this.listGroupItemConsoleLogTemplate.clone(true);
    $('span.list-group-item-log-message', newListGroupItemLog).html(message);
    $('span.list-group-item-log-date', newListGroupItemLog).text(new moment().format(standardTimeFormat));
    this.listGroupConsole.prepend(newListGroupItemLog.addClass(additionalClasses));
    return newListGroupItemLog;
};

dataJSONconsoleManager.prototype.empty = function () {
    this.listGroupConsole.empty();
    return this;
};

dataJSONconsoleManager.prototype.fadeInUpdating = function () {
    this.iConsoleUpdating.fadeIn(100);
    return this;
};

dataJSONconsoleManager.prototype.fadeOutUpdating = function () {
    this.iConsoleUpdating.fadeOut(100);
    return this;
};



$(document).ready(function () {


    //var spotGameManager = gameManager();
    var spotGameDataJSONconsoleManager = new dataJSONconsoleManager();

    //var spotGameDataJSONmanager = new dataJSONmanager();
    

    var dataJSONmanageProperties = new Object({
        updateIntervalMiliseconds: 1000,
        analyzed: 0
    });

    var gameProperties = new Object({
        initialized: false,
        actualTimeElapsedInterval: null,
        initializedMoment: null,
        modesAndTitles: new Object({
            untilMistakeMode: "Dokud se hráč nesplete",
            reachFinalCountCorrectMode: "Cílový počet správných stisknutí"
        }),
        actualTimeElapsed: '00:00:00'
    });

    var dataJSONeventTypesListeners = new Object();
    var addDataJSONeventTypesListener = function (eventTypes, callback) {
        eventTypes.split(/\s+/).forEach(function (eventType) {
            if (!Array.isArray(dataJSONeventTypesListeners[eventType])) {
                dataJSONeventTypesListeners[eventType] = new Array();
            }

            dataJSONeventTypesListeners[eventType].push(callback);
        });
    };

    var dataJSONupdateElemChangingValue = function (dataJSONelem, value) {
        $('span', dataJSONelem).first().text(value);
    };


    var dataJSONoutputElems = new Object({
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
        btnGameReset: $('.btn-game-reset')
    });

    var dataJSONoutputElemsDefaults = new Object({
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
        btnGameReset: 'Resetovat hru'
    });


    var adjustDataJSONoutputElemsToGameMode = function (dataJSON) {
        var elemDataTargetMode = 'data-target-mode';
        var elemsByGameMode = $('[' + elemDataTargetMode + ']');
        elemsByGameMode.not('[' + elemDataTargetMode + '="' + dataJSON.gameMode + '"]').remove();

        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemGameModeTitle, gameProperties.modesAndTitles[dataJSON.gameMode]);
    };

    var intiActualTimeElapsed = function () {
        gameProperties.initializedMoment = new moment();
        gameProperties.actualTimeElapsedInterval = setInterval(function () {
            gameProperties.actualTimeElapsed = moment.utc(new moment().diff(gameProperties.initializedMoment)).format(standardTimeFormat);
            dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemActualGameTimeElapsed, gameProperties.actualTimeElapsed);
        }, 1000);
    };


    addDataJSONeventTypesListener('gameInitialized', function (dataJSON) {
        spotGameDataJSONconsoleManager.empty().prependNewLog('Arduino deska resetována', 'list-group-item-success');

        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemLedTurnedOnDurationMiliseconds, dataJSON.ledTurnedOnDurationMiliseconds);
        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemMaxErrorRateIndex, dataJSON.maxErrorRateIndex);
        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemMistakesCountTolerance, dataJSON.mistakesCountTolerance);
        dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemFinalCountCorrect, dataJSON.finalCountCorrect);

        adjustDataJSONoutputElemsToGameMode(dataJSON);
        intiActualTimeElapsed();

        gameProperties.initialized = true;
    });

    addDataJSONeventTypesListener('gameCompleted gameOver', function (dataJSON) {
        clearInterval(checkForNewMultipleDataJSONInterval);
        clearInterval(gameProperties.actualTimeElapsedInterval);
        dataJSONupdateElemChangingValue(dataJSONoutputElems.btnGameReset, 'Hrát znovu');
        if (gameProperties.initialized) {
            savePlayerData(dataJSON);
        }

        spotGameDataJSONconsoleManager.fadeOutUpdating();
    });

    addDataJSONeventTypesListener('mistakesCountIncreased gameOver maxErrorRateIndexExceed', function () {
        return { logAdditionalClasses: 'list-group-item-danger' };
    });

    addDataJSONeventTypesListener('correctCountIncreased gameCompleted gameInitialized', function () {
        return { logAdditionalClasses: 'list-group-item-success' };
    });

    addDataJSONeventTypesListener('correctCountReached', function () {
        return { logAdditionalClasses: 'list-group-item-info' };
    });



    var processingDataJSON = function (dataJSON) {
        var logAdditionalClasses = new Array();

        if (dataJSONeventTypesListeners.hasOwnProperty(dataJSON.eventType)) {
            dataJSONeventTypesListeners[dataJSON.eventType].forEach(function (callback) {
                var eventRetObj = callback(dataJSON);
                if (eventRetObj instanceof Object) {
                    logAdditionalClasses.push(eventRetObj.logAdditionalClasses);
                }
            });
        }

        if (gameProperties.initialized) {
            spotGameDataJSONconsoleManager.prependNewLog(dataJSON.message, logAdditionalClasses.join(' '));

            dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemCorrectCounter, dataJSON.correctCounter);
            dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemMistakesCounter, dataJSON.mistakesCounter);
            dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemRemainsMistakesCountTolerance, dataJSON.mistakesCountTolerance - dataJSON.mistakesCounter > 0 ? dataJSON.mistakesCountTolerance - dataJSON.mistakesCounter : 0);
            dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemRemainsFinalCountCorrect, dataJSON.finalCountCorrect - dataJSON.correctCounter);
            dataJSONupdateElemChangingValue(dataJSONoutputElems.listGroupItemActualErrorRateIndex, new Number(dataJSON.correctCounter === 0 ? 0 : dataJSON.mistakesCounter / dataJSON.correctCounter).toFixed(2));
        }
    };

    var processingMultipleDataJSON = function (multipleDataJSON) {
        multipleDataJSON.forEach(function (dataJSON) {
            processingDataJSON(dataJSON);
        });
    };

    var checkForNewMultipleDataJSON = function () {
        $.ajax({
            url: "/board/data",
            method: "GET",
            dataType: "json",
            data: {
                skipMultipleDataJSON: dataJSONmanageProperties.analyzed
            },
            success: function (multipleDataJSON) {
                processingMultipleDataJSON(multipleDataJSON);
                dataJSONmanageProperties.analyzed += multipleDataJSON.length;
            }
        });
    };

    var savePlayerData = function (finalDataJSON) {
        $.ajax({
            url: "/board/save",
            method: "POST",
            dataType: "text",
            data: {
                gameMode: gameProperties.modesAndTitles[finalDataJSON.gameMode],
                correctCounter: finalDataJSON.correctCounter,
                mistakesCounter: finalDataJSON.mistakesCounter,
                ledTurnedOnDurationMiliseconds: finalDataJSON.ledTurnedOnDurationMiliseconds,
                mistakesCountTolerance: finalDataJSON.mistakesCountTolerance,
                finalCountCorrect: finalDataJSON.finalCountCorrect,
                gameTimeElapsed: gameProperties.actualTimeElapsed
            },
            success: function (data) {
                spotGameDataJSONconsoleManager.prependNewLog(data, 'list-group-item-info');
            },
            error: function (data) {
                console.log(data);
            }
        });
    };


    var gameReset = function (e) {
        e.preventDefault();
        gameProperties.initialized = false;

        $.ajax({
            url: "/board/reset",
            dataType: "text",
            success: function () {
                spotGameDataJSONconsoleManager.empty();

                clearInterval(gameProperties.actualTimeElapsedInterval);

                for (var key in dataJSONoutputElems) {
                    dataJSONupdateElemChangingValue(dataJSONoutputElems[key], dataJSONoutputElemsDefaults[key]);
                }

                dataJSONmanageProperties.analyzed = 0;
                spotGameDataJSONconsoleManager.fadeInUpdating().prependNewLog('Čekání na manuální resetování Arduino desky', 'list-group-item-danger');
            },
            error: function (data) {
                console.log(data);
            }
        });

        return false;
    };


    $('.btn-game-reset').on('click',
        gameReset
    ).trigger('click');



    var checkForNewMultipleDataJSONInterval = setInterval(function () {
        checkForNewMultipleDataJSON();
    }, dataJSONmanageProperties.updateIntervalMiliseconds);

    checkForNewMultipleDataJSON();


});   // do not delete