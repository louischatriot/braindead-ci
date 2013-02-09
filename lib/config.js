var config = {}
  , fs = require('fs')
  , configFileName, configFileContent, f
  ;


if (process.argv.length > 2) {
  configFileName = process.argv[2];
} else {
  configFileName = 'lib/configs/defaultConfig.js';
}


try {
  configFileContent = fs.readFileSync(configFileName, 'utf8');
  f = new Function('return ' + configFileContent);
  config = f();
} catch (e) {
  console.log("Problem reading or parsing the config file, error given: ", e);
  process.exit(1);
}

console.log(config);


module.exports = config;
