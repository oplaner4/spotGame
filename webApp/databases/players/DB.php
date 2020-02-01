<?php

function get_players ($toRootRelStr = './', $targetNicknameValues = '', $targetIdValues = '') {
    $sql = "SELECT * FROM players WHERE removed = 0 ";
    if (strlen($targetNicknameValues) > 0) {
        $sql .= "AND nickname IN ('".$targetNicknameValues."') ";
    }
    else if (strlen($targetIdValues) > 0) {
        $sql .= "AND id IN ('".$targetIdValues."') ";
    }

    $sql.="ORDER BY nickname ASC";

    
    include_once($toRootRelStr.'databases/access/connection.php');
    $connection = get_connection();

    $result = $connection->query($sql);
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

