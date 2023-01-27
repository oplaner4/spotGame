<?php

include_once('../BUILD_authorized.php');

$data = array();

include_once('../databases/access/connection.php');
include_once('../databases/tools/commands.php');
include_once('../databases/players/DB.php');
include_once('../databases/games/DB.php');
include_once('../storage/session.php');

$sessionData = getSessionData();

$players =  get_players ('../');
$games =  get_games ('../');

$players_by_id = array();

for ($i = 0; $i < count($players); $i++) {
    $players_by_id[$players[$i]['id']] = $players[$i];
}

for ($i = 0; $i < count($games); $i++) {
     $game = $games[$i];
     $game_player = $players_by_id[$game['playerId']];
     $game['nickname'] = $game_player['nickname'];
     array_push($data, $game);
}

echo json_encode($data);

?>