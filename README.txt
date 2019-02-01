This folder contains the Web-App for the SOGM.

The database will contain some dummy-data only (DSG Österreich).
All dependencies are listed in the README-files of the components (Server, Client).

For the database:
	Open the mysql-command-line and type:
		create user 'orchestra_root'@'127.0.0.1' identified with mysql_native_password by 'SOGMM_DB_ADMIN_#1';
		grant all privileges on *.* to 'orchestra_root'@'127.0.0.1';

General:
	The server runs with NodeJS. Therefore install NodeJS (https://nodejs.org/en/).
	Also install the npm typescript package by running following command in the cmd:
		npm install -g typescript.
	The client is written in Angular. Install AngularJs (https://angular.io/guide/quickstart).
	if there is a dependency missing, the errors will include information which module is missing.
	