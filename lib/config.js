var config = {}
  , fs = require('fs')
  , configFileName, configFileContent, f
  ;


if (process.argv.length > 2) {
  configFileName = process.argv[2];
  console.log("Loading config from file " + configFileName);
} else {
  configFileName = 'config/defaultConfig.js';
  console.log("No config file specified, loading default");
}


try {
  configFileContent = fs.readFileSync(configFileName, 'utf8');
  f = new Function('return ' + configFileContent);
  config = f();
} catch (e) {
  console.log("Problem reading or parsing the config file, error given: ", e);
  process.exit(1);
}


module.exports = config;
