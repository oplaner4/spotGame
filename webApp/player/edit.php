<?php

include_once('../BUILD_authorized.php');
include_once('../storage/session.php');
include_once('../databases/players/DB.php');

$messageSuccess = '';
$messageError = '';
$sessionData = getSessionData();
$current_player = $sessionData['player'];


if(isset($_POST['submit'])) {
    $nickname = $_POST['nickname'];

    if (isset($nickname)) {
        if (strlen($nickname) > 2) {
            include_once('../databases/access/connection.php');
            include_once('../databases/tools/commands.php');

            $current_player['nickname'] = $nickname;

            $connection = get_connection();
            if ($connection->query(get_update_sql_command ('players', $current_player)) === TRUE) {
                $sessionData = array();
                $sessionData['player'] = $current_player;
                setSessionData($sessionData);
                $messageSuccess = 'Vlastnosti hráče úspěšně uloženy';
            } else {
                 $messageError = 'Nastavení se nepodařilo uložit';
            }

            $connection->close();
        }
        else {
            $messageError = 'Pole přezdívka musí mít alespoň 3 znaky';
        }
    }
    else {
        $messageError = 'Pole přezdívka je povinné';
    }
}


if (strlen($messageError) > 0) {
   $messageError = '<div class="alert alert-danger">
    '.$messageError.'
</div>';
}

if (strlen($messageSuccess) > 0) {
   $messageSuccess = '<div class="alert alert-success">
    '.$messageSuccess.'
</div>';
}



build_page_authorized("Úprava hráče", basename($_SERVER["SCRIPT_FILENAME"], '.php' ), '
<div class="row">
    <div class="col-lg-7">
        '.$messageError.'
        '.$messageSuccess.'
        <form method="POST" action="/player/edit">
            <div class="form-group">
                <label for="nickname">Změnit přezdívku</label>
                <input tabindex="1" name="nickname" type="text" class="form-control" id="nickname" placeholder="Zadejte přezdívku" value="'.$current_player['nickname'].'">
            </div>

            <button type="submit" name="submit" class="btn btn-primary"><i class="fa fa-save"></i> Uložit</button>
        </form>
    </div>
</div>

', 'player/', '../');
?>