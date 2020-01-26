<?php

include_once('./session/session.php');

$sessionData = getSessionData();
if (!isset($sessionData) || count($sessionData) == 0) {
    echo "unauthorized";
    exit();
}

$skipMultipleDataJSON = 0;
if (isset($_POST['skipMultipleDataJSON'])) {
    $skipMultipleDataJSON = intval($_POST['skipMultipleDataJSON']);
}
else {
    $skipMultipleDataJSON = intval($skipMultipleDataJSON);
}

$output = array();

$handle = fopen("./data/serial.txt", "r");
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

sleep(2);
echo json_encode($output);


?>