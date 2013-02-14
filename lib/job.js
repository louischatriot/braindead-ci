/**
 * A job takes care of a branch on a repo.
 * Its config is stored in workspace/name_of_job.js
 * The corresponding Git repo used for tests is workspace/name_of_job
 *
 */
var config = require('./config')
  , fs = require('fs')
  , app = require('../app')
  , customUtils = require('./customUtils')
  , validation = require('./validation')
  , childProcess = require('child_process')
  , spawn = require('child_process').spawn
  , async = require('async')
  ;


/**
 * Constructor. Not to be called directly, use Job.getJob instead.
 */
function Job (options) {
  var keys = Object.keys(options)
    , i;

  for (i = 0; i < keys.length; i += 1) {
    this[keys[i]] = options[keys[i]];
  }
}


/**
 * Pull the repo, and create it if it doesn't exist
 * @param {Array} out Stream were everything that happens needs to be logged
 * @param {Function} callback Required callback
 */
Job.prototype.pullRepo = function (out, callback) {
  var self = this;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  async.waterfall([
    function (cb) {   // Ensure the repo exists, create it if needed
      customUtils.ensureFolderExists(Job.getRepoPath(self.name), function (err) {
        if (err) { return cb(err); }

        fs.readdir(Job.getRepoPath(self.name), function (err, files) {
          if (err) { return cb(err); }
          if (files.length > 0) { return cb(); }   // Files were found, we assume it's a Git repo. TODO: check for .git folder

          childProcess.exec('git clone ' + self.repoSSHUrl + ' .', {  cwd: Job.getRepoPath(self.name)  }, function (err, stdout, stderr) {
            out && out.write("=== First build, cloning the repository ===\n");
            out && out.write(stdout);
            out && out.write(stderr);
            return cb(err);
          })
        });
      });
    }
  , function (cb) {   // Pull it (will fail if branch doesn't exist)
      childProcess.exec('set -e; git checkout ' + self.branch + '; git pull', {  cwd: Job.getRepoPath(self.name)  }, function (err, stdout, stderr) {
        out && out.write(stdout);
        out && out.write(stderr);
        return cb(err);
      })
    }
  ], callback);
};


/**
 * (Re)install the dependencies
 * @param {Array} out Stream were everything that happens needs to be logged
 * @param {Function} callback Required callback
 */
Job.prototype.reinstallDependencies = function (out, callback) {
  var self = this, installer, needToReinstall = false;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  async.waterfall([
    function (cb) {   // Check if we need to reinstall dependencies
    customUtils.checkIfFilesAreIdentical(Job.getDependenciesInfoDir(self.name) + '/npm-shrinkwrap.json', Job.getRepoPath(self.name) + '/npm-shrinkwrap.json', function (err, sameN) {
      if (err) { return cb(err); }
      customUtils.checkIfFilesAreIdentical(Job.getDependenciesInfoDir(self.name) + '/package.json', Job.getRepoPath(self.name) + '/package.json', function (err, sameP) {
        if (err) { return cb(err); }
        needToReinstall = ! (sameN && sameP);
        cb();
      });
    });
  }
  , function (cb) {   // Reinstall if needed
    if (!needToReinstall) {
      out.write("=== Dependencies haven't changed, no need to reinstall\n");
      return cb();
    }

    childProcess.exec('rm -rf node_modules', { cwd: Job.getRepoPath(self.name) }, function (err, stdout, stderr) {
      if (err) { return cb(err); }

      installer = childProcess.spawn('npm', ['install'], { cwd: Job.getRepoPath(self.name) });
      out && installer.stdout.pipe(out, { end: false });
      out && installer.stderr.pipe(out, { end: false });

      installer.on('exit', function (code) {
        var error = code === 0 ? null : "Couldn't reinstall dependencies";
        cb(error);
      });
    });
  }
  , function (cb) {   // Copy dependency files
    customUtils.ensureFolderExists(Job.getDependenciesInfoDir(self.name), function (err) {
      if (err) { return cb(err); }
      customUtils.copySafe(Job.getRepoPath(self.name) + '/npm-shrinkwrap.json', Job.getDependenciesInfoDir(self.name) + '/npm-shrinkwrap.json', function (err) {
        if (err) { return cb(err); }
        customUtils.copySafe(Job.getRepoPath(self.name) + '/package.json', Job.getDependenciesInfoDir(self.name) + '/package.json', function (err) {
          return cb(err);
        });
      });
    });
  }
  ], callback);
};


/**
 * Run the tests
 * @param {Array} out Stream were everything that happens needs to be logged
 * @param {Function} callback Required callback
 */
Job.prototype.runTests = function (out, callback) {
  var self = this, tester;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  tester = childProcess.spawn('npm', ['test'], { cwd: Job.getRepoPath(self.name) });
  out && tester.stdout.pipe(out, { end: false });

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
    , channel = new customUtils.PassthroughStream();   // Use to centralize build outputs
    ;

  customUtils.ensureFolderExists(Job.getBuildsDir(this.name), function (err) {
    if (err) { return callback(err); }
    buildReport = fs.createWriteStream(Job.getBuildFilename(self.name, self.nextBuildNumber));
    out && channel.pipe(out);
    channel.pipe(process.stdout);
    channel.pipe(buildReport);

    async.waterfall([
      function (cb) {
        channel.write("=== Pulling new code ===\n");
        self.pullRepo(channel, function (err) {
          if (err) { buildReport.write("Couldn't pull the repository, error given: " + err); }
          cb(err);
        });
      }
    , function (cb) {
      channel.write("=== Reinstalling dependencies ===\n");
      self.reinstallDependencies(channel, function (err) {
        if (err) { channel.write("=== Problem reinstalling dependencies, error given: " + err); }
        cb(err);
      });
    }
    , function (cb) {
      channel.write("=== Running tests ===\n");
      var script = "cd " + Job.getRepoPath(self.name) + ";" + self.testScript;

      customUtils.executeBashScript(script, channel, function (err) {
        if (err) { channel.write("=== Tests didn't pass, error given: " + err); }
        cb(err);
      });
    }
    , function (cb) {
      channel.write("=== Deploying ===\n");
      customUtils.executeBashScript(self.deployScript, channel, function (err) {
        return cb(err);
      });
    }
    ], function (err) {
      buildReport.end();

      self.previousBuilds[self.nextBuildNumber] = { number: self.nextBuildNumber
                                                  , success: err ? false : true
                                                  , date: new Date()
                                                  };
      self.nextBuildNumber += 1;
      self.save(function () { callback(err); });
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
 * Get a job from its repo URL
 */



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
 * Edit an existing job
 */
Job.prototype.edit = function (newOptions, callback) {
  var keys = Object.keys(newOptions)
    , i;

  for (i = 0; i < keys.length; i += 1) {
    this[keys[i]] = newOptions[keys[i]];
  }

  this.save(callback);
};


/**
 * Save job state in its config file
 */
Job.prototype.save = function (callback) {
  var self = this
    , toBeSerialized = {}
    , propertiesToSave = [ 'name'
                         , 'githubRepoUrl'
                         , 'repoSSHUrl'
                         , 'branch'
                         , 'nextBuildNumber'
                         , 'previousBuilds'
                         , 'testScript'
                         , 'deployScript'
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
 * Load all jobs
 * For now we assume a one-to-one mapping between the list of directories and the list of jobs
 * TODO: check if real projects
 */
Job.loadAllJobsNames = function (callback) {
  fs.readdir(config.workspace, function (err, files) {
    var names = [];
    files.forEach(function (file) {
      if (validation.validateJobName(file)) { names.push(file); }
    });
    if (err) {
      return callback(err);
    } else {
      return callback(null, names.sort());
    }
  });
};


/**
 * Functions defining where the data is stored
 */
Job.getRootDir = function (name) { return config.workspace + '/' + name };
Job.getConfigPath = function (name) { return Job.getRootDir(name) + '/settings.conf'; };
Job.getRepoPath = function (name) { return Job.getRootDir(name) + '/repo'; };
Job.getBuildsDir = function (name) { return Job.getRootDir(name) + '/builds'; };
Job.getBuildFilename = function (name, buildNumber) { return Job.getBuildsDir(name) + '/build' + buildNumber + '.log'; };
Job.getDependenciesInfoDir = function (name) { return Job.getRootDir(name) + '/dependencies'; };


module.exports = Job;
