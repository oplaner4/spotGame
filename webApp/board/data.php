<?php

include_once('../data/serial.php');
include_once('../BUILD_authorized.php');
check_authorized ('../');

$skipMultipleDataJSON = 0;
if (isset($_GET['skipMultipleDataJSON'])) {
    $skipMultipleDataJSON = intval($_GET['skipMultipleDataJSON']);
}

$output = array();

$handle = fopen(get_serial_file_path("../"), "r");
if ($handle) {

    $linesDataPartsMerged = array();
    $linesDataTakeParts = 0;

    while (($lineJSON = fgets($handle)) !== false) {
        $lineDataPart = json_decode ( $lineJSON, true );
        
        if ($linesDataTakeParts > 0) {
            if (count($lineDataPart) > 0) {
                 $linesDataPartsMerged = array_merge($linesDataPartsMerged, $lineDataPart);
                 $linesDataTakeParts-=1;
            }

            if ($linesDataTakeParts === 0) {
                if ($skipMultipleDataJSON == 0) {
                     array_push($output, $linesDataPartsMerged);
                }
                else {
                    $skipMultipleDataJSON-= 1;
                }
                
                $linesDataPartsMerged = array();
            }
        }

        if (isset($lineDataPart['JSONparts'])) {
            if (strlen($lineDataPart['JSONparts']) > 0) {
                $linesDataTakeParts = intval($lineDataPart['JSONparts']);
            }
        }
    }

    fclose($handle);
} else {
    
}


echo json_encode($output);


?>