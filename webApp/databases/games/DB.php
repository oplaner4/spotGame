<?php

function get_games ($toRootRelStr = './', $targetPlayerId = '') {
    $sql = "SELECT * FROM games WHERE removed = 0 ";
    if (strlen($targetPlayerId) > 0) {
        $sql .= "AND playerId IN ('".$targetPlayerId."') ";
    }

    $sql.="ORDER BY correctCounter ASC";

    include_once($toRootRelStr.'databases/access/connection.php');
    $connection = get_connection();
    $result = $connection ->query($sql);

    $obj = array();

    if (!is_object($result)) {
        return $obj;
    }

    if ($result->num_rows > 0) {

        while ($data = $result->fetch_assoc()) {
                array_push($obj, $data);
        }
    }
    $connection->close();

    return $obj;
}

?>

