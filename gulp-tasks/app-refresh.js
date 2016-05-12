// To activate the meteor refresh logic create the JSON file "trigger-app-reload.json"
// next to the gulpfile.js with the following content:
// {
//    "watchedFolder": "/path/to/meteor/folder"
// }
// where the given path is a folder which meteor will reload automatically on a
// file change.
module.exports = function appRefresh() {
  var fs = require('fs'),
    path = require('path');

  var configFilePath = path.join(__dirname, 'trigger-app-reload.json'),
    configFile = null;

  try {
    configFile = fs.readFileSync(configFilePath);
  } catch (err) {
    console.log('No config file "trigger-app-reload.json" found, skipping reloading trigger...');
  }

  if (configFile) {
    var config = JSON.parse(configFile);

    if (config && config.watchedFolder) {
      var now = Date.now(),
        outputFilePath = path.join(config.watchedFolder, 'ignore-me-from-redsift-ui.js'),
        content = 'var now = ' + now + ';';

      fs.writeFile(outputFilePath, content, function() {
        console.log('Triggered application reload via "%s"...', outputFilePath);
      });
    }
  }
}
