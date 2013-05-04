var Job = require('./lib/job')
  , config = require('./lib/config')
  , customUtils = require('./lib/customUtils')
  , async = require('async')
  , jobsMetadata = {}
  , server = require('./server')
  , db = require('./lib/db')
  ;


/**
 * Initialize the application
 */
function init (callback) {
  customUtils.ensureFolderExists(config.workspace, function (err) {
    if (err) { return callback("Couldn't ensure the workspace exists"); }

    db.initialize(function (err) {
      if (err) { return callback("Couldn't initialize the database"); }

      server.launchServer(callback);
    });
  });
}


/*
 * If we executed this module directly, launch the server.
 * If not, let the module which required server.js launch it.
 */
if (module.parent === null) {
  init(function (err) {
    if (err) {
      console.log("An error occured, logging error and stopping the server");
      console.log(err);
      process.exit(1);
    } else {
      console.log('Workspace found. Server started on port ' + config.svPort);
    }
  });
}
