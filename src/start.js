var WebServer = require('./Webserver.js');
      
var printHelp = function printHelp() {
   console.log('usage: node ' + process.argv[1] + ' <root_folder_of_webpage>');
   console.log();
};

console.log();

if (process.argv.length !== 3) {
   
   printHelp();
   
} else {
   var webRootFolder = process.argv[2];
   
   console.log('webRootFolder: ' + webRootFolder);
   console.log();
   
   var webserver = new WebServer(webRootFolder);
   webserver.start();
}
