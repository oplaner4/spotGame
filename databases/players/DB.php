<?php

function get_players ($connection, $targetNicknameValues) {
    $sql = "SELECT * FROM players WHERE removed = 0 AND nickname IN (".$targetNicknameValues.") ORDER BY score ASC";
    $result = $connection->query($sql);

    $obj = array();

    if ($result->num_rows > 0) {

        while ($data = $result->fetch_assoc()) {
                array_push($obj, $data);
        }
    }
    $connection->close();

    return $obj;
}

?>

