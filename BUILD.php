<?php

function build_page($title, $viewName, $HTML = '', $subFolderPath = '', $toRootRelStr = './') {
  $toRoot = $toRootRelStr;

  include_once($toRoot.'storage/session.php');
  $sessionData = getSessionData();

  echo'<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>'.$title.' - SpotGame</title>
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/css/bootstrap-4.4.1.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/fontawesome-5.12.0/css/brands.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/fontawesome-5.12.0/css/fontawesome.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/fontawesome-5.12.0/css/solid.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/datatables/DataTables-1.10.20/css/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/datatables/FixedHeader-3.1.6/css/fixedHeader.bootstrap4.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/datatables/Responsive-2.2.3/css/responsive.bootstrap4.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/datatables/RowGroup-1.1.1/css/rowGroup.dataTables.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/datatables/RowGroup-1.1.1/css/rowGroup.bootstrap4.min.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/css/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" href="'.$toRoot.'assets/css/index.css" />
    
    <link rel="shortcut icon" type="image/x-icon" href="'.$toRoot.'assets/img/favicon/icon.ico" />
    <meta content="Made in Microsoft Visual Studio" />
    <!--[if lt IE 9]><meta http-equiv="refresh" content="0;url=https://browser-update.org/cs/update.html"><![endif]-->
    <meta charset="UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <!--Document scripts-->
    <script type="text/javascript" src="'.$toRoot.'assets/js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/js/popper.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/js/bootstrap-4.4.1.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/js/cookies.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/js/media.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/js/moment.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/datatables/DataTables-1.10.20/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/datatables/DataTables-1.10.20/js/dataTables.bootstrap4.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/datatables/FixedHeader-3.1.6/js/dataTables.fixedHeader.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/datatables/Responsive-2.2.3/js/dataTables.responsive.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/datatables/Responsive-2.2.3/js/responsive.bootstrap4.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/datatables/RowGroup-1.1.1/js/dataTables.rowGroup.min.js"></script>
    <script type="text/javascript" src="'.$toRoot.'assets/datatables/RowGroup-1.1.1/js/rowGroup.bootstrap4.min.js"></script>
   
    <script type="text/javascript" src="'.$toRoot.'assets/js/index.js"></script>
</head>
<body>
    <noscript>
        <style>
            .content, .container-loading {
                display: none;
            }
        </style>
        <div style="max-width:550px;" class="m-auto px-2">
            <div>
                <img class="w-100" src="'.$toRoot.'assets/img/nojs.png" />
            </div>
            <div class="text-center h5">
                Pro plnou funkčnost těchto stránek je nutné povolit JavaScript.
                Zde jsou <br /><a href="http://www.enable-javascript.com/cz/" target="_blank">instrukce, jak na to</a>
            </div>
        </div>
    </noscript>
    <div class="container-loading"><div></div></div>
    <script>
        var ww = $(window);
        var duration = 100;
        ww.on("load", function () {
            $(".container-loading").fadeOut(duration, function () {
                $(".content").fadeIn(duration * 3);
            });
        });
    </script>
    <div class="content">
        <div class="header d-flex flex-column bg-site">
            <div class="navbar-area">
                <nav class="container navbar navbar-expand-lg navbar-dark pl-lg-3 justify-content-around">
                    <a class="navbar-brand" href="'.$toRoot.'index">
                        <i class="fas fa-lightbulb text-warning"></i> SpotGame
                    </a>
                    <button class="navbar-toggler d-flex d-lg-none" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="fa fa-bars text-white"></i> <h6 class="mb-0 align-self-center pl-2 text-white">MENU</h6>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav w-100 my-3 my-lg-0 justify-content-end text-center">
                            ';

                            if (isset($sessionData['player'])) {
                                echo '
                                <li class="nav-item'; if ($subFolderPath == 'board' && $viewName == 'index') { echo ' active'; }; echo'">
                                    <a class="nav-link" href="'.$toRoot.'board"><i class="fa fa-gamepad"></i> Panel</a>
                                </li>
                                <li class="nav-item'; if ($subFolderPath == '' && $viewName == 'statistics') { echo ' active'; }; echo'">
                                    <a class="nav-link" href="'.$toRoot.'statistics"><i class="fa fa-chart-bar"></i> Statistika</a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarAdministraceDropdown" role="button" data-toggle="dropdown" aria-haspopup="true">
                                        <i class="fa fa-user"></i> hráč <span class="text-info"><b>'.$sessionData['player']['nickname'].'</b></span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarAdministraceDropdown">
                                        <a class="dropdown-item" href="'.$toRoot.'player_switch"><i class="fa fa-sign-out-alt"></i> Jiný hráč</a>
                                    </div>
                                </li>
                                ';
                            }
                            else {
                                echo '
                                   <li class="nav-item'; if ($subFolderPath == '' && $viewName == 'index') { echo ' active'; }; echo'">
                                        <a class="nav-link" href="'.$toRoot.'index"><i class="fa fa-home"></i> Úvod</a>
                                   </li>
                                   <li class="nav-item'; if ($subFolderPath == '' && $viewName == 'set') { echo ' active'; }; echo'">
                                        <a class="nav-link" href="'.$toRoot.'set"><i class="fa fa-cog"></i> Nastavení</a>
                                    </li>
                                ';
                            }
                            echo '
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div class="main-container mb-5 mt-3 mt-lg-5">
            <div class="container text-center text-md-left mb-4">
                <h3 class="mb-4">'.$title.'</h3>
                <div class="pl-md-2">
                    '; echo strlen($HTML) > 0 ? $HTML:file_get_contents($toRoot.$subFolderPath.'views/'.$viewName.'.html'); echo'
                </div>
            </div>
        </div>


        <div class="footer bg-site text-white text-center px-4 py-3">&copy;'; echo date("Y"); echo' SpotGame | <span>&nbsp;Vytvořil: <a class="font-weight-bold text-info" title="napsat e-mail" href="mailto:oplaner4@gmail.com">oplaner4@gmail.com</a></span></div>
        <a href="#body" class="upto bg-site px-2 py-1 rounded-circle mb-2"><i class="fa fa-arrow-up text-white font-weight-bold"></i></a>
    
        <div class="modal fade modal-confirm" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Potvrďte prosím...</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" title="Zavřit dialogové okno">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <a class="btn btn-danger btn-ok">Ok</a>
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Zrušit</button>
                    </div>
                </div>
            </div>
        </div>

</div>
</body>
</html>
 ';
 }
?>