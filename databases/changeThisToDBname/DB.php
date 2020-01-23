<?php

function get_record ($connection, $targetValue = '0') {
    $sql = "SELECT * FROM database name WHERE removed = 0 AND some column name IN (".$targetArchivedValue.") AND some other column name IN (".$targetArchivedValue.")  ORDER BY some column value ASC";
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

