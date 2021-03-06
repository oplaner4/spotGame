<?php

include_once('BUILD_authorized.php');

$data = array();
$player_data = array();

include_once('./databases/access/connection.php');
include_once('./databases/tools/commands.php');
include_once('./databases/players/DB.php');
include_once('./databases/games/DB.php');
include_once('./storage/session.php');

$sessionData = getSessionData();

$players =  get_players ();
$games =  get_games ();

$current_player_id = $sessionData['player']['id'];
$players_by_id = array();

for ($i = 0; $i < count($players); $i++) {
    $players_by_id[$players[$i]['id']] = $players[$i];
}

for ($i = 0; $i < count($games); $i++) {
     $game = $games[$i];
     $game_player = $players_by_id[$game['playerId']];
     $game['nickname'] = $game_player['nickname'];
     array_push($data, $game);

     if ($game['playerId'] === $current_player_id) {
         array_push($player_data, $game);
     }
}

build_page_authorized("Statistika", basename($_SERVER["SCRIPT_FILENAME"], '.php' ), '

<h5>Přihlášený hráč</h5>
<div class="pl-md-2 mb-5">
    <div class="d-inline-block mb-3 table-responsive-sm">
        <table class="table table-striped table-borderless player-games-table" style="width: 100%">
            <thead class="bg-site text-white">
                <tr>
                    <th scope="col">Herní mód</th>
                    <th scope="col">Přezdívka</th>
                    <th scope="col">Počet špatných stisknutí</th>
                    <th scope="col">Počet správných stisknutí</th>
                    <th scope="col">Počet zameškaných stisknutí</th>
                    <th scope="col">Herní čas</th>
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
                    <th scope="col">Herní mód</th>
                    <th scope="col">Přezdívka</th>
                    <th scope="col">Počet špatných stisknutí</th>
                    <th scope="col">Počet správných stisknutí</th>
                    <th scope="col">Počet zameškaných stisknutí</th>
                    <th scope="col">Herní čas</th>
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
                order: [[2, "asc"], [3, "desc"], [4, "asc"], [5, "asc"]],
                orderFixed: [0, "asc" ],
                columnDefs: [
                    { targets: "disableOrdering", orderable: false },
                    { type: "num", targets: [2, 3, 4] },
                    { type: "momentTime", targets: [1] }
                ],
                rowGroup: {
                    dataSrc: "gameMode"
                },
                columns: [
                    { data: "gameMode" },
                    { data: "nickname" },
                    { data: "mistakesCounter" },
                    { data: "correctCounter" },
                    { data: "missedCounter" },
                    { data: "gameTimeElapsed" }
                ]
            };

            var bestGamesDatatableOptions = $.extend(true, {}, gamesDatatableOptions, {
                data: '.json_encode($data).',
                lengthMenu: [3, 10, 25, 50],
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