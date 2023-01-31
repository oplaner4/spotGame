$(function () {
    let spotGameDataJSONconsoleManager = new dataJSONconsoleManager();
    let spotGameDataJSONmanager = new dataJSONmanager(1000);
    let spotGameManager = new gameManager(spotGameDataJSONmanager, spotGameDataJSONconsoleManager);

    let btnSpotGameReset = $('.btn.btn-game-reset');

    spotGameDataJSONmanager.addEventTypesListener('gameInitialized', function () {
        spotGameManager.initActualTimeElapsed();

    }).addEventTypesListener('arduinoBoardReseted', function (dataJSONhelper) {
        spotGameManager.initialize(dataJSONhelper);

    }).addEventTypesListener('gameWon gameOver', function (dataJSONhelper) {
        spotGameManager.end().savePlayerData(dataJSONhelper);
        $('span', btnSpotGameReset).text('Hrát znovu');

    }).addEventTypesListener('mistakesCountIncreased gameOver unableToReadSerial', function () {
        return { logAdditionalClasses: 'list-group-item-danger' };

    }).addEventTypesListener('correctCountIncreased gameWon arduinoBoardReseted', function () {
        return { logAdditionalClasses: 'list-group-item-success' };

    }).addEventTypesListener('gameInitialized mistakesToleranceExceeded', function () {
        return { logAdditionalClasses: 'list-group-item-info' };

    }).addEventTypesListener('maxErrorRateIndexExceeded', function () {
        return { logAdditionalClasses: 'list-group-item-warning' };

    }).addEventTypesListener('newDataJSON', function (dataJSONhelper) {
        spotGameManager.update(dataJSONhelper);
    });


    btnSpotGameReset.on('click', function (e) {
        e.preventDefault();
        $('span', this).text('Resetovat hru');
        spotGameManager.reset();
    }).trigger('click');

});