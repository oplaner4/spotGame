$(document).ready(function () {
    var spotGameDataJSONconsoleManager = new dataJSONconsoleManager();
    var spotGameDataJSONmanager = new dataJSONmanager(1000);
    var spotGameManager = new gameManager(spotGameDataJSONmanager, spotGameDataJSONconsoleManager);

    var btnSpotGameReset = $('.btn.btn-game-reset');

    spotGameDataJSONmanager.addEventTypesListener('gameInitialized', function () {
        spotGameManager.initActualTimeElapsed();

    }).addEventTypesListener('arduinoBoardReseted', function (dataJSONhelper) {
        spotGameManager.initialize(dataJSONhelper);

    }).addEventTypesListener('gameCompleted gameOver', function (dataJSONhelper) {
        spotGameManager.end().savePlayerData(dataJSONhelper);
        $('span', btnSpotGameReset).text('Hrát znovu');

    }).addEventTypesListener('mistakesCountIncreased gameOver', function () {
        return { logAdditionalClasses: 'list-group-item-danger' };

    }).addEventTypesListener('correctCountIncreased gameCompleted arduinoBoardReseted', function () {
        return { logAdditionalClasses: 'list-group-item-success' };

    }).addEventTypesListener('correctCountReached gameInitialized', function () {
        return { logAdditionalClasses: 'list-group-item-info' };

    }).addEventTypesListener('maxErrorRateIndexExceed', function () {
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