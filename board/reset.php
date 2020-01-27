<?php

include_once('../data/serial.php');
include_once('../BUILD_authorized.php');
check_authorized ('../');

$fp = fopen(get_serial_file_path("../"), "r+");
ftruncate($fp, 0);
fclose($fp);


?>