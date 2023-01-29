<?php

include_once('../BUILD_authorized.php');
include_once('../storage/session.php');

$sessionData = getSessionData();
$current_player_id = $sessionData['player']['id'];

build_page_authorized("Statistika", basename($_SERVER["SCRIPT_FILENAME"], '.php' ), '

<h5>Přihlášený hráč</h5>
<div class="pl-md-2 mb-5">
    <div class="mb-3 table-responsive-sm">
        <table class="table table-striped table-borderless player-games-table" style="width: 100%">
            <thead class="bg-site text-white">
                <tr>
                    <th scope="col">Herní mód</th>
                    <th scope="col">Přezdívka</th>
                    <th scope="col">Špatná stisknutí</th>
                    <th scope="col">Správná stisknutí</th>
                    <th scope="col">Zameškaná stisknutí</th>
                    <th scope="col">Herní čas</th>
                    <th scope="col">Celkové zpoždění</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="clearfix"></div>
</div>

<h5>Nejlepší hráči</h5>
<div class="pl-md-2">
    <div class="mb-3 table-responsive-sm">
        <table class="table table-striped table-borderless best-games-table" style="width: 100%">
            <thead class="bg-site text-white">
                <tr>
                    <th scope="col">Herní mód</th>
                    <th scope="col">Přezdívka</th>
                    <th scope="col">Špatná stisknutí</th>
                    <th scope="col">Správná stisknutí</th>
                    <th scope="col">Zameškaná stisknutí</th>
                    <th scope="col">Herní čas</th>
                    <th scope="col">Celkové zpoždění</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="clearfix"></div>
</div>

    <input type="hidden" name="currentPlayerId" value="'.$current_player_id.'" />
    <script type="text/javascript" src="../scripts/statistics/index.js"></script>

', 'statistics/', '../');

?>