/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , config = require('./lib/config')
  , expressServer
  , app = require('./app')
  , Job = require('./lib/job')
  , routes = require('./lib/routes')
  , middlewares = require('./lib/middlewares')
  , customUtils = require('./lib/customUtils')
  , h4e = require('h4e')
  , executor = require('./lib/executor')
  , beforeEach = require('express-group-handlers').beforeEach
  ;


expressServer = express();

if (config.trustProxy) {
  expressServer.enable('trust proxy');
}

//Set up templating
h4e.setup({ app: expressServer
          , baseDir: config.templatesDir
          , toCompileDirs: ['.']
          , extension: 'mustache'
          });


/**
 * Middlewares
 *
 */

expressServer.use(express.bodyParser());
expressServer.use(expressServer.router);


// Serving static files from paths that can't be confused with the webpages
expressServer.get('/assets/css/:file', express.static(__dirname));
expressServer.get('/assets/jquery/:file', express.static(__dirname));
expressServer.get('/assets/socket.io/:file', express.static(__dirname));
expressServer.get('/assets/bootstrap/:dir/:file', express.static(__dirname));
expressServer.get('/favicon.ico', function (req, res, next) { return res.send(404); });   // No favicon

// Serve the webpages
beforeEach(expressServer, middlewares.commonRenderValues, function (expressServer) {
  expressServer.get('/', routes.index);

  // Create, edit or show a job
  expressServer.get('/jobs/new', routes.createJob.displayForm);
  expressServer.post('/jobs/new', routes.createJob.create, routes.createJob.displayForm);
  expressServer.get('/jobs/:name/edit', routes.createJob.populateFormForEdition, routes.createJob.displayForm);
  expressServer.get('/jobs/:name', routes.jobHomepage);

  // Create or show a build
  expressServer.get('/jobs/:name/builds/new', routes.build.newBuildWebpage);
  expressServer.get('/jobs/:name/builds/:buildNumber', routes.build.buildRecap);
  expressServer.get('/jobs/:name/builds/:buildNumber/log', routes.build.buildLog);

});

// Handle payload delivered by Github
expressServer.post('/public/githubwebhook', routes.handleGithubWebhook);

// Test
expressServer.get('/current', function (req, res, next) {
  res.json(200, executor.getCurrentJob());
});


/*
 * Connect to database, then start server
 */
expressServer.launchServer = function (cb) {
  var callback = cb ? cb : function () {}
    , self = this
    ;

  app.init(function (err) {
    if (err) { return callback(err); }

    self.apiServer = http.createServer(self);   // Let's not call it 'server' we never know if Express will want to use this variable!

    // Handle any connection error gracefully
    self.apiServer.on('error', function () {
      return callback("An error occured while launching the server, probably a server is already running on the same port!");
    });

    // Begin to listen. If the callback gets called, it means the server was successfully launched
    self.apiServer.listen.apply(self.apiServer, [config.svPort, callback]);
  });
};


/*
 * Stop the server
 * No new connections will be accepted but existing ones will be served before closing
 */
expressServer.stopServer = function (cb) {
  var callback = cb ? cb : function () {}
    , self = this;

  self.apiServer.close(function () {
    console.log('Server was stopped');
    callback();
  });
};


/*
 * If we executed this module directly, launch the server.
 * If not, let the module which required server.js launch it.
 */
if (module.parent === null) {
  expressServer.launchServer(function (err) {
    if (err) {
      console.log("An error occured, logging error and stopping the server");
      console.log(err);
      process.exit(1);
    } else {
      console.log('Workspace found. Server started on port ' + config.svPort);
    }
  });
}

