<?php

include_once('../BUILD_authorized.php');
include_once('../storage/session.php');

$sessionData = getSessionData();
$current_player_id = $sessionData['player']['id'];

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

            let currentPlayerId = "'.$current_player_id.'";

            let bestGamesDatatableOptions = $.extend(true, {}, gamesDatatableOptions, {
                lengthMenu: [3, 10, 25, 50],
            });

            let playerGamesDatatableOptions = $.extend(true, {}, gamesDatatableOptions, {
                data: [],
            });

            let bestGamesTable = $(".table.best-games-table");
            let playerGamesTable = $(".table.player-games-table");

            initDatatable(bestGamesTable, bestGamesDatatableOptions);
            initDatatable(playerGamesTable, playerGamesDatatableOptions);

            const loadData = () => {
                $.ajax({
                    url: "/statistics/data",
                    method: "GET",
                    dataType: "json",
                    success: (data) => {
                        bestGamesTable.DataTable().clear().rows.add(data).draw();
                        playerGamesTable.DataTable().clear().rows.add(data.filter(r => r.playerId === currentPlayerId)).draw();
                    }
                });
            };

            loadData();
            setInterval(loadData, 30 * 1000);
    });
    </script>


', 'statistics', '../');

?>