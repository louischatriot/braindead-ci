/**
 * Options for Braindead. Order of priority: command-line, config file, defaults
 */
var config = {}
  , fs = require('fs')
  , configFileContent, f, configFileParameters
  , program = require('commander')
  , availableOptions = ['serverPort', 'forgotPassword']
  ;


// Don't launch commander if we are in test mode so that mocha can use its command line arguments
if (process.env.NODE_ENV === 'test') {
  config = { dbRootUrl: 'workspace/_testData/'
           , serverPort: 2010
           , forgotPassword: false
           , templatesDir: 'templates'
           , workspace: 'workspace'
           };
} else {
  program.version('0.1.0')
    .option('-p --server-port [port]', 'Port to launch the webserver on', parseInt)
    .option('-c --config-file [path]', 'Path to a config file, see config/exampleConfig.js for an example')
    .option('-f --forgot-password', 'Use this options if you forgot your password')
    .parse(process.argv);


  // Command-line arguments have the highest priority
  availableOptions.forEach(function (opt) {
    config[opt] = program[opt];
  });


  // Then come config file arguments
  // Don't forget that the options in the config file are the camel-cased versions of the
  // command-line ones (e.g. server-port becomes serverPort)
  // See config/exampleConfig.js for an example
  if (program.configFile) {
    try {
      configFileContent = fs.readFileSync(program.configFile, 'utf8');
      f = new Function('return ' + configFileContent);
      configFileParameters = f();

      availableOptions.forEach(function (opt) {
        config[opt] = config[opt] || configFileParameters[opt];
      });
    } catch (e) {
      console.log("Couldn't read and parse the given config file, its parameters won't be used");
      console.log("The config file needs to be a valid javascript object containing the options.");
      console.log("You can use comments but the first character needs");
      console.log("to be the opening { (no empty line or comment)");
    }
  }


  // And finally defaults
  config.serverPort = config.serverPort || 2008;
  config.forgotPassword = config.forgotPassword || false;
  config.templatesDir = 'templates';
  config.workspace = 'workspace';
  config.dbRootUrl = 'workspace/_data/';
}




// Warning for forgot password mode
if (config.forgotPassword) {
  console.log("==================================================================================");
  console.log("=== You are in forgot password mode, go on the website to create a new account ===");
  console.log("==================================================================================");
}



module.exports = config;
