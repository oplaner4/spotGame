<?php
    function get_connection () {
        $servername = "localhost";
        $username = "spot";
        $password = "1234";
        $dbname = "spotgame";

        $conn = new mysqli($servername, $username, $password, $dbname);
        mysqli_set_charset($conn,"utf8");

        if ($conn->connect_error) {
           die("Connection failed: " . $conn->connect_error);
        }

        return $conn;
    }
?>
