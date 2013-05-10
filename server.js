/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , config = require('./lib/config')
  , expressServer
  , Job = require('./lib/job')
  , routes = require('./lib/routes')
  , middlewares = require('./lib/middlewares')
  , customUtils = require('./lib/customUtils')
  , h4e = require('h4e')
  , executor = require('./lib/executor')
  , beforeEach = require('express-group-handlers').beforeEach
  , NedbStore = require('connect-nedb-session')(express)
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

// Middlewares
expressServer.use(middlewares.serveFavicon);
expressServer.use(express.bodyParser());
expressServer.use(express.cookieParser());
expressServer.use(express.session({ secret: 'thats some secret'
                                  , key: 'braindeadsess'
                                  , cookie: { path: '/'
                                            , httpOnly: true
                                            , maxAge: 365 * 24 * 3600 * 1000   // One year
                                            }
                                  , store: new NedbStore({ filename: 'workspace/_data/session.db' })
                                  }));
expressServer.use(middlewares.populateLoggedInUser);
expressServer.use(expressServer.router);


// Serving static files from paths that can't be confused with the webpages
expressServer.get('/assets/css/:file', express.static(__dirname));
expressServer.get('/assets/jquery/:file', express.static(__dirname));
expressServer.get('/assets/socket.io/:file', express.static(__dirname));
expressServer.get('/assets/bootstrap/:dir/:file', express.static(__dirname));
expressServer.get('/favicon.ico', function (req, res, next) { return res.send(404); });   // No favicon

// Login, logout
expressServer.get('/login', middlewares.commonRenderValues, routes.login.displayForm);
expressServer.post('/login', middlewares.commonRenderValues, routes.login.checkCredentials, routes.login.displayForm);
expressServer.get('/logout', routes.logout);

// Serve the webpages
beforeEach(expressServer, middlewares.commonRenderValues, middlewares.needToBeLoggedIn, middlewares.checkFirstTimeUse, function (expressServer) {
  expressServer.get('/', routes.index);

  // Show the settings page
  expressServer.get('/settings', routes.settings.displayForm);
  expressServer.post('/settings', routes.settings.update, routes.settings.displayForm);

  // User account maangement
  expressServer.get('/users', routes.users.showAll);
  expressServer.get('/users/create', routes.users.userCreationForm);
  expressServer.post('/users/create', routes.users.createUser, routes.users.userCreationForm);
  expressServer.get('/users/:login/edit', routes.users.userEditionForm);
  expressServer.post('/users/:login/edit', routes.users.editUser);
  expressServer.delete('/users/:login', routes.users.removeUser);

  // Create, edit or show a job
  expressServer.get('/jobs/new', routes.jobs.displayForm);
  expressServer.post('/jobs/new', routes.jobs.create);
  expressServer.get('/jobs/:name/edit', routes.jobs.populateFormForEdition, routes.jobs.displayForm);
  expressServer.post('/jobs/:name/edit', routes.jobs.edit);
  expressServer.get('/jobs/:name', routes.jobs.homepage);

  expressServer.put('/jobs/:name/enable', routes.setEnabledState.enableJob);
  expressServer.put('/jobs/:name/disable', routes.setEnabledState.disableJob);

  // Create or show a build
  expressServer.get('/jobs/:name/builds/new', routes.build.newBuildWebpage);
  expressServer.get('/jobs/:name/builds/:buildNumber', routes.build.buildRecap);
  expressServer.get('/jobs/:name/builds/:buildNumber/log', routes.build.buildLog);
});

// Handle payload delivered by Github
expressServer.post('/githubwebhook', routes.handleGithubWebhook);

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

  self.apiServer = http.createServer(self);   // Let's not call it 'server' we never know if Express will want to use this variable!

  // Handle any connection error gracefully
  self.apiServer.on('error', function () {
    return callback("An error occured while launching the server, probably a server is already running on the same port!");
  });

  // Begin to listen. If the callback gets called, it means the server was successfully launched
  self.apiServer.listen.apply(self.apiServer, [config.svPort, callback]);
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


// Interface
module.exports = expressServer;
