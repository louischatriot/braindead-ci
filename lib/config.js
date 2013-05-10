/**
 *
 */
var config = {}
  , fs = require('fs')
  , configFileContent, f, configFileParameters
  , program = require('commander')
  ;

program.version('0.1.0')
  .option('-p --server-port [port]', 'Port to launch the webserver on', parseInt)
  .option('-c --config-file [path]', 'Path to a config file, see config/exampleConfig.js for an example')
  .option('-f --forgot-password', 'Use this options if you forgot your password')
  .parse(process.argv);


// Command-line arguments have the highest priority
config.serverPort = program.serverPort;


// Then come config file arguments
// Don't forget that the options in the config file are the camel-cased versions of the
// command-line ones (e.g. server-port becomes serverPort)
// See config/exampleConfig.js for an example
if (program.configFile) {
  try {
    configFileContent = fs.readFileSync(program.configFile, 'utf8');
    f = new Function('return ' + configFileContent);
    configFileParameters = f();

    config.serverPort = config.serverPort || configFileParameters.serverPort;
  } catch (e) {
    console.log("Couldn't read and parse the given config file, its parameters won't be used");
    console.log("The config file needs to be a valid javascript object containing the options.");
    console.log("You can use comments but the first character needs");
    console.log("to be the opening { (no empty line or comment)");
  }
}


// And finally defaults
config.serverPort = config.serverPort || 2008;
config.templatesDir = 'templates';
config.workspace = 'workspace';


console.log(config);

module.exports = config;
