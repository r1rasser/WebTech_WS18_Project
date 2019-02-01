This folder contains the Web-App-Client.

To run the app 
(cmd):
	ng build --prod
	http-server -p 4200 -c-1 dist/orchestra-client
(browser):
	http://localhost:4200

Dependencies (npm):
	npm install --save -g http-server
	npm install --save -g @angular/http
	npm install --save -g @angular/material
	npm install --save -g @angular/cdk
	npm install --save -g @angular/forms
	npm install --save -g ngx-socket-io
	npm install --save -g reflect-metadata
	npm install --save -g socket.io
	npm install --save -g socket.io-client
	npm install --save -g zone.js
	npm install --save -g ng-multiselect-dropdown
	npm install --save -g ng-pick-datetime
	npm install --save -g @angular/cdk/scrolling
	npm install --save -g @angular/service-worker
	npm install --save -g crypto-js