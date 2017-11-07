var FileSystem = require('./FileSystem.js');
var express = require('express');
var bodyParser = require('body-parser');
	
var SERVER_PORT      = 8080;
var LOGGING_ENABLED  = false;

var app = express();
var fileSystem = new FileSystem();


var addToLog = function addToLog(message) {
   if (LOGGING_ENABLED) {
      console.log(message);
   }
};


var logRequest = function logRequest(request,response, next) {

   addToLog('\nREQUEST for "' + request.url + '" received');
   next();
};


var replaceSpacesInRequestUrlByEscapeSequence = function replaceSpacesInRequestUrlByEscapeSequence(request,response, next) {

   request.url = request.url.replace(/%20/g, ' ');
   next();
};


var sendInternalServerError = function sendInternalServerError(response, text) {
   
   addToLog('Sending error status 500 because of: ' + text);
   response.writeHeader(500, {'Content-Type': 'text/plain'});  
   response.write(text);  
   response.end();
};


var sendOkResponse = function sendOkResponse(response, content) {
   
   response.writeHeader(200, {'Content-Type': 'text/html'});  
   response.write(content);  
   response.end();
};


var Constructor = function Constructor(webRootFolder) {
	
   var handleFileRequests = function handleFileRequests(request,response) {

      var requestedDocumentUrl = request.url;
      
      addToLog('\n--- handleFileRequests ---');
      addToLog('requestedDocumentUrl: ' + requestedDocumentUrl);
      
      var absolutePathOfRequest = webRootFolder + requestedDocumentUrl;
         
      if (!fileSystem.exists(absolutePathOfRequest)) {
         
         sendInternalServerError(response, 'file ' + absolutePathOfRequest + ' does not exist');
         
      } else {

         addToLog('returning ' + absolutePathOfRequest);
         response.sendFile(requestedDocumentUrl, { root: webRootFolder } );
      }
   };
   

	this.start = function start() {

      app.use(bodyParser.text());
	
		// app.get(path, callback [, callback ...])
		// Routes HTTP GET requests to the specified path to the specified callback functions. 
		app.get('*', replaceSpacesInRequestUrlByEscapeSequence);
		app.get('*', logRequest);
		app.get('*', handleFileRequests );
		
      app.post('/cgi-bin/*', function (request, response) {
        console.log('post request received for ' + request.path);
        sendOkResponse(response, 'post request received');
      });
		
		console.log('starting webserver ...');

		var server = app.listen(SERVER_PORT, function (listeningEvent) {
			
			var host = server.address().address;
			var port = server.address().port;
			console.log('listening at http://%s:%s', host, port);
		});
	};
};

module.exports = Constructor;