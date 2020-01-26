<?php

include_once('BUILD_player.php');

if($_SERVER['REQUEST_METHOD'] === 'POST') {
        include_once('./databases/access/connection.php');
        include_once('./databases/tools/commands.php');
        include_once('./databases/players/DB.php');
        include_once('./databases/games/DB.php');
        include_once('./session/session.php');

        $sessionData = getSessionData();
        $player_id = $sessionData['player']['id'];

        $player =  get_players (get_connection(), '', $player_id) [0];

        $game = array();
        $game['playerId'] = $player_id;
        $game['gameMode'] = $_POST['gameMode'];
        $game['correctCounter'] = $_POST['correctCounter'];
        $game['mistakesCounter'] = $_POST['mistakesCounter'];
        $game['ledTurnedOnDurationMiliseconds'] = $_POST['ledTurnedOnDurationMiliseconds'];
        $game['mistakesCountTolerance'] = $_POST['mistakesCountTolerance'];
        $game['finalCountCorrect'] = $_POST['finalCountCorrect'];
        $game['gameTimeElapsed'] = $_POST['gameTimeElapsed'];
        $game['removed'] = 0;
        $game['id'] = uniqid();

        $connection = get_connection();
        $connection2 = get_connection();
        if (
               $connection->query(get_update_sql_command('players', $player)) === TRUE && 
               $connection2->query(get_insert_sql_command('games', $game)) === TRUE
        ) {
             echo 'Výsledky hráče úspěšně uloženy';
        }
        else {
            echo 'Výsledky hráče se nepodařilo uložit';
        }


        $connection->close();
        $connection2->close();
}
else {
    build_player_page("Panel", basename($_SERVER["SCRIPT_FILENAME"], '.php' ));
}

?>