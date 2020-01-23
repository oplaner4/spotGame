<?php

session_start();

if (!isset($_SESSION['CREATED'])) {
    $_SESSION['CREATED'] = time();
} else if (time() - $_SESSION['CREATED'] > 30*60) {
    session_regenerate_id(true);
    $_SESSION['CREATED'] = time();
}

function getSessionData() {
    session_start();
    return $_SESSION["sessionData"];
}


function setSessionData($sessionData) {
    session_start();
    $_SESSION["sessionData"] = $sessionData;
}

?>