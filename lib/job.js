/**
 * A job takes care of a branch on a repo.
 * Its config is stored in workspace/name_of_job.js
 * The corresponding Git repo used for tests is workspace/name_of_job
 *
 */
var config = require('./config')
  , fs = require('fs')
  , customUtils = require('./customUtils')
  , childProcess = require('child_process')
  , spawn = require('child_process').spawn
  , async = require('async')
  ;


/**
 * Constructor. Not to be called directly, use Job.getJob instead.
 */
function Job (options) {
  this.name = options.name;
  this.repo = options.repo;
  this.branch = options.branch;
  this.nextBuildNumber = options.nextBuildNumber;
  this.previousBuilds = options.previousBuilds;
}


/**
 * Pull the repo, and create it if it doesn't exist
 */
Job.prototype.pullRepo = function (callback) {
  var self = this;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  async.waterfall([
    function (cb) {   // Ensure the repo exists, create it if needed
      customUtils.ensureFolderExists(Job.getRepoPath(self.name), function (err) {
        if (err) { return cb(err); }

        fs.readdir(Job.getRepoPath(self.name), function (err, files) {
          if (err) { return cb(err); }
          if (files.length > 0) { return cb(); }   // Files were found, we assume it's a Git repo. TODO: check for .git folder

          childProcess.exec('git clone ' + self.repo + ' .', {  cwd: Job.getRepoPath(self.name)  }, function (err, stdout, stderr) {
            return cb(err);
          })
        });
      });
    }
  , function (cb) {   // Pull it (will fail if branch doesn't exist)
      childProcess.exec('set -e; git checkout ' + self.branch + '; git pull', {  cwd: Job.getRepoPath(self.name)  }, function (err, stdout, stderr) {
        return cb(err);
      })
    }
  ], callback);
};


/**
 * (Re)install the dependencies
 */
Job.prototype.reinstallDependencies = function (outs, callback) {
  var self = this, installer;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  console.log("REINSTALL");

  childProcess.exec('rm -rf node_modules', { cwd: Job.getRepoPath(self.name) }, function (err, stdout, stderr) {
    if (err) { return callback(err); }

    installer = childProcess.spawn('npm', ['install'], { cwd: Job.getRepoPath(self.name) });
    customUtils.pipeStreamIntoMultipleStreams(installer.stdout, outs);

    installer.on('exit', function (code) {
      var error = code === 0 ? null : "Couldn't reinstall dependencies";
      callback(error);
    });
  });
};


/**
 * Run the tests
 * @param {Array} outs All streams to pipe stdout to
 * @param {Function} callback Required callback
 */
Job.prototype.runTests = function (outs, callback) {
  var self = this, tester;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  tester = childProcess.spawn('make', ['test'], { cwd: Job.getRepoPath(self.name) });
  customUtils.pipeStreamIntoMultipleStreams(tester.stdout, outs);

  tester.on('exit', function (code) {
    var error = code === 0 ? null : 'Tests failed';
    callback(error);
  });
};


/**
 * Launch a build
 */
Job.prototype.build = function (out, callback) {
  var self = this
    , buildReport
    ;

  customUtils.ensureFolderExists(Job.getBuildsDir(this.name), function (err) {
    if (err) { return callback(err); }
    buildReport = fs.createWriteStream(Job.getBuildFilename(self.name, self.nextBuildNumber));

    async.waterfall([
    function (cb) {   // Pulling the repo
      buildReport.write("=== Pulling repository\n");
      self.pullRepo(function (err) {
        if (err) { buildReport.write("Couldn't pull the repository, error given: ", err); }
        cb(err);
      });
    }
    , function (cb) {   // Reinstalling the dependencies if needed
      buildReport.write("\n\n=== Reinstalling dependencies\n");

      self.reinstallDependencies([out, buildReport], function (err) {
        if (err) { buildReport.write("Couldn't pull the repository, error given: ", err); }
        cb(err);
      });
    }
    ], function (err) {
      buildReport.end();

      self.previousBuilds[self.nextBuildNumber] = { number: self.nextBuildNumber
                                                   , success: err ? false : true
                                                   , date: new Date()
                                                   };
      self.nextBuildNumber += 1;
      self.save(function (err) { callback(err); });
    });
  });
};


/**
 * Get a build's info
 */
Job.prototype.getBuild = function (buildNumber, callback) {
  var self = this;

  fs.readFile(Job.getBuildFilename(self.name, parseInt(buildNumber, 10)), 'utf8', function (err, data) {
    var buildData = {};

    if (err) {
      return callback('Build number ' + buildNumber + ' doesn\'t exist or data is corrupted');
    } else {
      buildData = self.previousBuilds[buildNumber];
      buildData.log = data;

      return callback(null, buildData);
    }
  });
};


/**
 * Recreate a job from a filesystem conf file
 */
Job.getJob = function (name, callback) {
  if (!name) { return callback("This job doesn't have a name"); }

  Job.loadConfig(name, function (err, conf) {
    var j;
    if (err) { return callback (err); }
    if (!conf) { return callback('Job ' + name + ' not found!'); }

    return callback(null, new Job(conf));
  });
};


/**
 * Create a new job
 */
Job.createJob = function (options, callback) {
  options.nextBuildNumber = 1;
  options.previousBuilds = {};
  j = new Job(options);
  j.save(function (err) {
    return callback(err, j);
  });
}


/**
 * Save job state in its config file
 */
Job.prototype.save = function (callback) {
  var self = this
    , toBeSerialized = {}
    , propertiesToSave = [ 'name'
                         , 'repo'
                         , 'branch'
                         , 'nextBuildNumber'
                         , 'previousBuilds'
                         ]
    ;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  propertiesToSave.forEach(function (prop) { toBeSerialized[prop] = self[prop]; });
  customUtils.ensureFolderExists(Job.getRootDir(self.name), function (err) {
    if (err) { return callback(err); }
    fs.writeFile(Job.getConfigPath(self.name), JSON.stringify(toBeSerialized), 'utf8', callback);
  });
};


/**
 * Try to load a config from the filesystem
 */
Job.loadConfig = function (name, callback) {
  fs.exists(Job.getConfigPath(name), function (exists) {
    if (!exists) { return callback(); }

    fs.readFile(Job.getConfigPath(name), 'utf8', function (err, data) {
      var f, config;

      if (err) { return callback(err); }

      try {
        f = new Function('return ' + data);
        config = f();
      } catch (e) {
        return callback(e);
      }

      return callback(null, config);
    });
  });
};


/**
 * Functions defining where the data is stored
 */
Job.getRootDir = function (name) { return config.workspace + '/' + name };
Job.getConfigPath = function (name) { return Job.getRootDir(name) + '/' + name + '.conf'; };
Job.getRepoPath = function (name) { return Job.getRootDir(name) + '/repo'; };
Job.getBuildsDir = function (name) { return Job.getRootDir(name) + '/builds'; };
Job.getBuildFilename = function (name, buildNumber) { return Job.getBuildsDir(name) + '/build' + buildNumber + '.log'; };





//var testJob = { name: 'api'
              //, repo: 'git@github.com:tldrio/tldr-api.git'
              //, branch: 'master'
              //};

//Job.createJob({ name: 'mongo-edit'
              //, repo: 'git@github.com:tldrio/mongo-edit.git'
              //, branch: 'master'
              //}, function (err) {
                //console.log("==DONE==");
                //console.log(err);
              //});


//Job.getJob('mongo-edit', function (err, job) {
  //console.log("=============");
  //console.log(err);
  //console.log(job);

  //console.log('------- BUILDING -----------');
  //job.build(process.stdout, function (err) {
    //console.log("=============");
    //console.log(err);
  //});
//});




module.exports = Job;
