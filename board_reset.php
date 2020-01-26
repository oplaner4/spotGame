<?php

include_once('./session/session.php');

$sessionData = getSessionData();
if (!isset($sessionData) || count($sessionData) == 0) {
    echo "unauthorized";
    exit();
}

include_once('./data/serial.php');
$fp = fopen(get_serial_file_path("./"), "r+");
ftruncate($fp, 0);
fclose($fp);


?>