# SpotGame - Web Application

This document contains essential information to make the Web Application working on **Windows** platform.

## WampServer installation

1) Install WampServer in version **3.2.<=2** (not higher), select the newest **Mysql** and **PHP**. Keep other settings unchanged.
2) Run **WampServerXX** where *XX* is **64** or **32** bit version.
3) Go to [http://localhost/](http://localhost/) in your favourite browser.
4) Open `C:\wamp64\bin\apache\apacheXXXXX\conf\extra\httpd-vhosts.conf` file where *XXXXX* is the version of Apache.
5) Replace **${INSTALL_DIR}/www** (2 occurences) with **absolute path of this cloned directory** (`X:\\path\to\cloned\repository\spotGame\webApp`) there. Save changes.
6) Restart all WampServer services.
7) You should see App Home page on the link from the **3. step**.

### Make database working

1) Go to [phpmyadmin](http://localhost/phpmyadmin).
2) You should be on the **Sign in page**. Fill in name: '**root**'. Do not fill password, do not change server - keep MariaDB.
3) Navigate to the 'Database' tab (leftmost).
4) Fill in name of the database: '**spotgame**'. Click the 'Create' button.
5) Go to [import page](http://localhost/phpmyadmin/db_import.php?db=spotgame).
6) Click the 'Choose File' button.
7) Select `./databases/create.sql` file.
8) Click the 'execute' button on the bottom.
 
### Make it accessible from any local computer

1) In the file from the **4. step** (above) replace **Require local** with **Require all granted**. Save changes.
2) Restart all WampServer services.
3) You may need to turn off your Firewall service or add an exception for `C:\wamp64\bin\apache\apacheXXXXX\bin\httpd.exe` executable where *XXXXX* is the version of Apache.
4) From another computer go to **http://IPADRESS/** where *IP_ADRESS* is an **IPv4 adress** of the hosting computer. This adress can be get by the **ipconfig** command in the 'Command Prompt'.

### Connect to the database from any local computer

1) Open `C:\wamp64\alias\phpmyadmin.conf` file.
2) Replace **Require local** with **Require all granted**.
3) Replace **Allow from localhost ::1 127.0.0.1** with **Allow from all**. Save changes.
4) Restart all WampServer services.
5) You may need to turn off your Firewall service or add an exception for `C:\wamp64\bin\mariadb\mariadbXXXXX\bin\mysqld.exe` executable where *XXXXX* is the version of MariaDB.
6) Go to [Add user form](http://localhost/phpmyadmin/server_privileges.php?adduser=1).
7) Fill in computer name: '**%**' and user credentials, from global privileges **grant only 'Data' section** (not other). Click the 'Execute' button on the bottom.
8) On the other computer change `./databases/access/connection.php` file.

## Author

* Developed by Ondrej Planer ([oplaner4@gmail.com](mailto:oplaner4@gmail.com)).
* Co-workers: Ondrej Nemec (idea), Vojtech Varecha (troubleshooter), Jiri Pokorny (board).

## License

SpotGame can be freely distributed under the **MIT license**.
