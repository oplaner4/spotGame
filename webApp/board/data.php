<?php

include_once('../data/serial.php');
include_once('../BUILD_authorized.php');
check_authorized ('../');

$skipOffset = 0;
if (isset($_GET['skipOffset'])) {
    $skipOffset = intval($_GET['skipOffset']);
}

$dataToProcess = array();

$handle = fopen(get_serial_file_path("../"), "r");

if ($handle) {
    fseek($handle, $skipOffset, SEEK_SET);

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
                array_push($dataToProcess, $linesDataPartsMerged);
                $linesDataPartsMerged = array();
                $skipOffset = ftell($handle);
            }
        }

        if (isset($lineDataPart['JSONparts'])) {
            if (strlen($lineDataPart['JSONparts']) > 0) {
                $linesDataTakeParts = intval($lineDataPart['JSONparts']);
            }
        }
    }

    echo json_encode(array(
        "queue" => $dataToProcess,
        "skipOffset" => $skipOffset,
    ));

    fclose($handle);
} else {
    echo json_encode(array(
        "queue" => array(array("eventType" => "unableToReadSerial", "message" => "Nelze získat data z Arduino desky")),
        "skipOffset" => -1,
    ));
}

?>