$(document).ready(function () {
    var spotGameDataJSONconsoleManager = new dataJSONconsoleManager();
    var spotGameDataJSONmanager = new dataJSONmanager(1000);
    var spotGameManager = new gameManager(spotGameDataJSONmanager, spotGameDataJSONconsoleManager);
    var spotGameReset = $('.btn.btn-game-reset');
    spotGameDataJSONmanager.addEventTypesListener('gameInitialized', function (dataJSON) {
        spotGameManager.initialize(dataJSON);
    }).addEventTypesListener('gameCompleted gameOver', function (dataJSON) {
        spotGameManager.end().savePlayerData(dataJSON);
        $('span', spotGameReset).text('Hrát znovu');

    }).addEventTypesListener('mistakesCountIncreased gameOver maxErrorRateIndexExceed', function () {
        return { logAdditionalClasses: 'list-group-item-danger' };

    }).addEventTypesListener('correctCountIncreased gameCompleted gameInitialized', function () {

        return { logAdditionalClasses: 'list-group-item-success' };
    }).addEventTypesListener('correctCountReached', function () {
        return { logAdditionalClasses: 'list-group-item-info' };

    })/*.addEventTypesListener('settingsInfo gameModeSet', function () {
        return { logAdditionalClasses: 'list-group-item-secondary' };

    })*/.addEventNewDataListener(function (dataJSON, logAdditionalClasses) {
        spotGameManager.update(dataJSON, logAdditionalClasses);
    });




    spotGameReset.on('click', function (e) {
        e.preventDefault();
        $('span', this).text('Resetovat hru');
        spotGameManager.reset();
    }).trigger('click');

});   // do not delete