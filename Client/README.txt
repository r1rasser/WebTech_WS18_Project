This folder contains the Web-App-Client.

To open the app 
(cmd):
	npm install --save http-server -g
	ng build --prod
	http-server -p 4200 -c-1 dist/orchestra-client
(browser):
	http://localhost:4200

note that config.ts in the client and config.json in the server have to be adjusted!
replace the IP-address in config.ts - config_network with your IP-Address (same for config.json).
To get your IP-address type ipconfig in the cmd.

Dependencies (npm):
	
