$(document).ready(function () {
    var spotGameDataJSONconsoleManager = new dataJSONconsoleManager();
    var spotGameDataJSONmanager = new dataJSONmanager(1000);
    var spotGameManager = new gameManager(spotGameDataJSONmanager, spotGameDataJSONconsoleManager);
    var spotGameReset = $('.btn.btn-game-reset');

    spotGameDataJSONmanager.addEventTypesListener('gameInitialized', function () {
        spotGameManager.initActualTimeElapsed();

    }).addEventTypesListener('arduinoBoardReseted', function (dataJSONhelper) {
        spotGameManager.initialize(dataJSONhelper);

    }).addEventTypesListener('gameCompleted gameOver', function (dataJSONhelper) {
        spotGameManager.end().savePlayerData(dataJSONhelper);
        $('span', spotGameReset).text('Hrát znovu');

    }).addEventTypesListener('mistakesCountIncreased gameOver', function () {
        return { logAdditionalClasses: 'list-group-item-danger' };

    }).addEventTypesListener('correctCountIncreased gameCompleted gameInitialized arduinoBoardReseted', function () {
        return { logAdditionalClasses: 'list-group-item-success' };

    }).addEventTypesListener('correctCountReached maxErrorRateIndexExceed', function () {
        return { logAdditionalClasses: 'list-group-item-info' };

    }).addEventNewDataListener(function (dataJSONhelper) {
        spotGameManager.update(dataJSONhelper);
    });




    spotGameReset.on('click', function (e) {
        e.preventDefault();
        $('span', this).text('Resetovat hru');
        spotGameManager.reset();
    }).trigger('click');

});   // do not delete