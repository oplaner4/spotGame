# SpotGame - Web Application

This document contains essential information to make the Web Application working on **Windows** platform.

## WampServer installation

1) Install WampServer in version **3.2.2** (not higher), select the newest **Mysql** and **PHP**. Keep other settings unchanged.
2) Run **WampServerXX** where *XX* is **64** or **32** bit version.
3) Go to [http://localhost/](http://localhost/) in your favourite browser.
4) Open `C:\wamp64\bin\apache\apacheX\conf\extra\httpd-vhosts.conf` file where *X* is the version of Apache.
5) Replace **${INSTALL_DIR}/www** (2 occurences) with **absolute path of this cloned directory** (`X:\\path\to\cloned\repository\spotGame\webApp`) there. Save changes.
6) Restart all WampServer services.
7) You should see App Home page on the link from the **3. step**.

### Make it accessible from any local computer

1) In the file from the **4. step** (above) replace **Require local** with **Require all granted**. Save changes.
2) Restart all WampServer services.
3) You may need to turn off your Firewall service or change Firewall service settings.
4) From another computer go to **http://IPADRESS/** where *IP_ADRESS* is an **IP adress** of the hosting computer.

### Connect to the database from any local computer

1) Open `C:\wamp64\alias\phpmyadmin.conf` file.
2) Replace **Require local** with **Require all granted**.
3) Replace **Allow from localhost ::1 127.0.0.1** with **Allow from all**. Save changes.
4) Restart all WampServer services.
5) You may need to turn off your Firewall service or change Firewall service settings.
6) Note: You have to create a database user account with access from any computer.
7) Change `./databases/access/connection.php` file.

## Author

* Developed by Ondrej Planer ([oplaner4@gmail.com](mailto:oplaner4@gmail.com)).
* Co-workers: Ondrej Nemec (idea), Vojtech Varecha (troubleshooter), Jiri Pokorny (board).

## License

SpotGame can be freely distributed under the **MIT license**.
