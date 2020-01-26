<?php



include_once('./session/session.php');

$sessionData = getSessionData();
if (!isset($sessionData) || count($sessionData) == 0) {
    echo "unauthorized";
    exit();
}

$data = array();
$player_data = array();

include_once('./databases/access/connection.php');
include_once('./databases/tools/commands.php');
include_once('./databases/players/DB.php');
include_once('./databases/games/DB.php');

$players =  get_players (get_connection());

$games =  get_games (get_connection());

$players_by_id = array();

for ($i = 0; $i < count($players); $i++) {
    $players_by_id[$players[$i]['id']] = $players[$i];
}

for ($i = 0; $i < count($games); $i++) {
     $game = $games[$i];
     $game_player = $players_by_id[$game['playerId']];
     $game['nickname'] = $game_player['nickname'];
     array_push($data, $game);

     if ($game['playerId'] === $sessionData['player']['id']) {
         array_push($player_data, $game);
     }
}


include_once('BUILD_player.php');
build_player_page("Statistika", basename($_SERVER["SCRIPT_FILENAME"], '.php' ), '

<h5>Přihlášený hráč</h5>
<div class="pl-md-2">
    <div class="d-inline-block mb-3 table-responsive-sm">
        <table class="table table-striped table-borderless player-games-table" style="width: 100%">
            <thead class="bg-site text-white">
                <tr>
                    <th class="disableOrdering" scope="col">Přezdívka</th>
                    <th class="" scope="col">Počet správných stisknutí</th>
                    <th class="" scope="col">Počet špatných stisknutí</th>
                    <th class="" scope="col">Doba trvání rozsvícené LED</th>
                    <th class="" scope="col">Tolerance špatných stisknutí</th>
                    <th class="" scope="col">Herní čas</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="clearfix"></div>
</div>

<h5>Nejlepší hráči</h5>
<div class="pl-md-2">
    <div class="d-inline-block mb-3 table-responsive-sm">
        <table class="table table-striped table-borderless best-games-table" style="width: 100%">
            <thead class="bg-site text-white">
                <tr>
                    <th class="disableOrdering" scope="col">Přezdívka</th>
                    <th class="" scope="col">Počet správných stisknutí</th>
                    <th class="" scope="col">Počet špatných stisknutí</th>
                    <th class="" scope="col">Doba trvání rozsvícené LED</th>
                    <th class="" scope="col">Tolerance špatných stisknutí</th>
                    <th class="" scope="col">Herní čas</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="clearfix"></div>
</div>

    <script>
        $(function () {

            var gamesDatatableOptions = {
                order: [[1, "desc"], [2, "asc"], [3, "asc"], [4, "asc"], [5, "asc"]],
                columnDefs: [
                    { targets: "disableOrdering", orderable: false },
                    { type: "num", targets: [1, 2, 3, 4] },
                    { type: "momentTime", targets: [5] }
                ],
                rowGroup: {
                    dataSrc: "gameMode"
                },
                columns: [
                    { data: "nickname" },
                    { data: "correctCounter" },
                    { data: "mistakesCounter" },
                    { data: "ledTurnedOnDurationMiliseconds" },
                    { data: "mistakesCountTolerance" },
                    { data: "gameTimeElapsed" }
                ]
            };

            var bestGamesDatatableOptions = $.extend(true, {}, gamesDatatableOptions, {
                data: '.json_encode($data).'
            });

            var playerGamesDatatableOptions = $.extend(true, {}, gamesDatatableOptions, {
                data: '.json_encode($player_data).'
            });

            initDatatable($(".table.best-games-table"), bestGamesDatatableOptions);
            initDatatable($(".table.player-games-table"), playerGamesDatatableOptions);
    });
    </script>


');

?>