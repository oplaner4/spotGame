<?php
function get_insert_sql_command ($tableName, $insData) {

     if(!isset($insData['id'])) {
       throw new Exception("uniqid has not been set for column 'id'!");
    }

    $insData['dateCreated'] = date('Y-m-d\TH:i:s.uP', time());
    session_start();
    $insData['createdBy'] = $_SESSION["username"];

    $columns = implode(", ", array_keys($insData));
    $values = "'".implode("','", array_values($insData))."'";
    return 'INSERT INTO '.$tableName.' ('.$columns.') VALUES ('.$values.')';
}


function get_update_sql_command ($tableName, $insData) {
    $insData['dateModified'] = date('Y-m-d\TH:i:s.uP', time());
    session_start();
    $insData['modifiedBy'] = $_SESSION["username"];

    $keys = array_keys($insData);
    $arr = array();
    $command = 'UPDATE '.$tableName.' SET ';
    for ($i = 0; $i < count($keys); $i++) {
        array_push($arr, $keys[$i]."="."'".$insData[$keys[$i]]."'");
    }

    $command.=implode(", ", $arr);
    $command.=" WHERE id='".$insData['id']."'";

    return $command;
}

?>