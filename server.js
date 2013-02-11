/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , config = require('./lib/config')
  , app
  , Job = require('./lib/job')
  , routes = require('./lib/routes')
  , middlewares = require('./lib/middlewares')
  , h4e = require('h4e');


app = express();

if (config.trustProxy) {
  app.enable('trust proxy');
}

 //Set up templating
h4e.setup({ app: app
          , baseDir: config.templatesDir
          , toCompileDirs: ['.']
          , extension: 'mustache'
          });


/**
 * Middlewares
 *
 */

app.use(express.bodyParser());
//app.use(middlewares.commonRenderValues);
app.use(app.router);


// Serving static files from paths that can't be confused with the webpages
app.get('/assets/css/:file', express.static(__dirname));
app.get('/assets/jquery/:file', express.static(__dirname));
app.get('/assets/bootstrap/:dir/:file', express.static(__dirname));
app.get('/favicon.ico', function (req, res, next) { return res.send(404); });   // No favicon

// Serve the webpages
app.get('/', middlewares.commonRenderValues, routes.index);
app.get('/jobs/new', middlewares.commonRenderValues, routes.createJob.displayForm);
app.post('/jobs/new', middlewares.commonRenderValues, routes.createJob.create, routes.createJob.displayForm);
app.get('/jobs/:name', middlewares.commonRenderValues, routes.jobHomepage);
app.get('/jobs/:name/builds/:buildNumber', middlewares.commonRenderValues, routes.buildRecap);



/*
 * Connect to database, then start server
 */
app.launchServer = function (cb) {
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
app.stopServer = function (cb) {
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
  app.launchServer(function (err) {
    if (err) {
      console.log("An error occured, logging error and stopping the server");
      console.log(err);
      process.exit(1);
    } else {
      console.log('Server started on port ' + config.svPort);
    }
  });
}


/*
 * If SIGINT is received (from Ctrl+C or from Upstart), gracefully stop the server then exit the process
 * FOR NOW: commented out because browsers use hanging connections so every shutdown actually takes a few seconds (~5) if a browser connected to the server
 *          which makes for a way too long restart
 */
//process.on('SIGINT', function () {
  //app.stopServer(function () {
    //console.log('Exiting process');
    //process.exit(0);
  //});
//});



// exports
module.exports = app;
