<?php

include_once('BUILD.php');
include_once('./session/session.php');

function redir_set () {
    include_once('./helpers/redirectHelper.php');
    redirect('set');
    exit();
}


$sessionData = getSessionData();
if (!isset($sessionData) || count($sessionData) == 0) {
    redir_set();
}


function build_player_page ($title, $viewName, $HTML = '', $toRootRelStr = './') {
    include_once('./session/session.php');
    build_page($title, $viewName, $HTML, $toRootRelStr, getSessionData());
}


?>