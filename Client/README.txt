This folder contains the Web-App-Client.

To run the app 
(cmd):
	npm install --save http-server -g
	ng build --prod
	http-server -p 4200 -c-1 dist/orchestra-client
(browser):
	http://localhost:4200

Dependencies (npm):
	npm install --save -g @angular/http
	npm install --save -g @angular/material
	npm install --save -g @angular/forms
	npm install --save -g ngx-socket-io
	npm install --save -g ng-multiselect-dropdown
	npm install --save -g ng-pick-datetime
	npm install --save -g @angular/cdk/scrolling
	npm install --save -g @angular/service-worker
	npm install --save -g crypto-js