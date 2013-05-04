/**
 * A job takes care of a branch on a repo.
 * Its config is stored in workspace/name_of_job.js
 * The corresponding Git repo used for tests is workspace/name_of_job
 *
 */
var config = require('./config')
  , fs = require('fs')
  , customUtils = require('./customUtils')
  , validation = require('./validation')
  , childProcess = require('child_process')
  , spawn = require('child_process').spawn
  , async = require('async')
  , rimraf = require('rimraf')
  , db = require('./db')
  ;



// =============================================================
// Job creation, edition, deletion
// =============================================================

/**
 * Constructor. Not to be called directly, use Job.getJob instead.
 */
function Job (jobData) {
  var keys = Object.keys(jobData)
    , i, self = this;

  Job.propertiesToSave().forEach(function (prop) {
    self[prop] = jobData[prop];
  });
}


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
 * Get the fields we want to save in the jobs settings
 */
Job.propertiesToSave = function () {
  return propertiesToSave = [ 'name'
                            , 'githubRepoUrl'
                            , 'repoSSHUrl'
                            , 'branch'
                            , 'nextBuildNumber'
                            , 'previousBuilds'
                            , 'testScript'
                            , 'deployScript'
                            , 'enabled'
                            , '_id'
                            ];
};


/**
 * Validate a job (synchronous)
 */
Job.validate = function (jobData) {
  var validators = {}
    , errors = []
    , fields// = Object.keys(jobData)
    , field, i
    ;

  // Register all validators
  function registerValidator (field, validator, errorMessage) {
    validators[field] = { validator: validator
                        , errorMessage: errorMessage };
  }
  registerValidator('name', validation.validateJobName, 'The name must be composed of between 1 and 16 alphanumerical characters and spaces');
  registerValidator('githubRepoUrl', validation.validateJobGithubRepoUrl, 'Please enter a valid Git repo url');
  registerValidator('repoSSHUrl', validation.validateJobRepoSSHUrl, 'Please enter a valid Git repo SSH url');
  registerValidator('branch', validation.validateJobBranch, 'Please enter a branch name');
  registerValidator('testScript', validation.accept, '');
  registerValidator('deployScript', validation.accept, '');

  fields = Object.keys(validators);

  // Actually perform validation
  for (i = 0; i < fields.length; i += 1) {
    field = fields[i];
    if (validators[field].validator(jobData[field]) === false) {
      errors.push(validators[field].errorMessage);
    }
  }

  return errors.length > 0 ? errors : null;
};


/**
 * Create a new job
 */
Job.createJob = function (jobData, callback) {
  jobData.nextBuildNumber = 1;
  jobData.previousBuilds = {};
  jobData.enabled = true;
  j = new Job(jobData);

  // Persist job to the database and create its root directory
  customUtils.ensureFolderExists(Job.getRootDir(j.name), function (err) {
    if (err) { return callback(err); }

    j.save(function (err) {
      return callback(err, j);
    });
  });
}


/**
 * Set new value for a job's enabled state
 */
Job.prototype.setEnabledValue = function (newValue, callback) {
  var self = this;

  self.enabled = newValue;
  self.save(function (err) { return callback(err); });
};


/**
 * Specific field editing functions
 * They take care of changing a job's property and the "side effects" (if any)
 * Side effects are the stuff Braindead needs to do on top of just changing the Job object's properties
 * For example changing the root directory in the workspace when you change a job's name
 * All with the same signature: newValue, callback([err])
 * To be call with Function.call to provide the correct this
 */
Job.getEditableProperties = function () {
  // The order of fields is important, as some have an impact on the others downstream
  // name impacts repoSSHUrl (needs to pull the new repo in the right directory)
  // branch impacts repoSSHUrl (needs to create the new repo on the correct branch)
  return ['name', 'branch', 'githubRepoUrl', 'repoSSHUrl', 'testScript', 'deployScript'];
};

Job._edit = {};

// Register an editing function that just changes the field and saves the new object, with no side effect
function justChangeField (property) {
  Job._edit[property] = function (newValue, callback) {
    this[property] = newValue;
    this.save(callback);
  };
}
justChangeField('branch');
justChangeField('githubRepoUrl');
justChangeField('testScript');
justChangeField('deployScript');

Job._edit.name = function (newValue, callback) {
  var self = this;

  // Rename job directory
  fs.rename(Job.getRootDir(self.name), Job.getRootDir(newValue), function (err) {
    if (err) { return callback(err); }

    self.name = newValue;
    self.save(function (err) {
      if (err) { return callback(err); }
      return callback();
    });
  });
};

Job._edit.repoSSHUrl = function (newValue, callback) {
  var self = this
    , executor = require('./executor')   // We need to require it here to break the circular dependency
    ;

  rimraf(Job.getRepoPath(self.name), function (err) {
    if (err) { return callback(err); }

    self.repoSSHUrl = newValue;
    self.save(function (err) {
      if (err) { return callback(err); }

      // Will take care of cloning the new repo
      executor.registerBuild(self.name);
    });

    return callback();
  });
}



/**
 * Edit an existing job
 */
Job.prototype.edit = function (newOptions, callback) {
  var keys = Object.keys(newOptions)
    , self = this
    , editableProperties = Job.getEditableProperties()
    , i = 0
    ;

  async.whilst( function () { return i < editableProperties.length; }
  , function (cb) {
    var property = editableProperties[i];
    i += 1;

    if (self[property] !== newOptions[property]) {
      return Job._edit[property].call(self, newOptions[property], cb);
    } else {
      return cb();
    }
  }
  , callback);
};


/**
 * Save job state in its config file
 */
Job.prototype.save = function (callback) {
  var self = this
    , toSave = {}
    , query = this._id ? { _id: this._id } : { name: this.name }
    ;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  Job.propertiesToSave().forEach(function (prop) { toSave[prop] = self[prop]; });
  db.jobs.update(query, toSave, { upsert: true }, function (err) {
    return callback(err);
  });
};


/**
 * Try to load a config from the filesystem
 */
Job.loadConfig = function (name, callback) {
  db.jobs.findOne({ name: name }, callback);
};


/**
 * Load all jobs
 * For now we assume a one-to-one mapping between the list of directories and the list of jobs
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
 * Get a build's data
 */
Job.prototype.getBuild = function (buildNumber, callback) {
  var self = this;
  if (! self.previousBuilds[buildNumber]) { return callback('Build number ' + buildNumber + ' doesn\'t exist'); }

  fs.readFile(Job.getBuildFilename(self.name, parseInt(buildNumber, 10)), 'utf8', function (err, data) {
    var buildData = {};
    if (err) { return callback('Build number ' + buildNumber + ' doesn\'t exist or data is corrupted'); }

    buildData = self.previousBuilds[buildNumber];
    buildData.log = data;

    return callback(null, buildData);
  });
};


// ==================================================
// Job building
// ==================================================


/**
 * Pull the repo, and create it if it doesn't exist
 * @param {WritableStream} out Stream were everything that happens needs to be logged
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
 * Check if we need to reinstall the dependencies, that's what takes most of the build time
 * @param {WritableStream} out Stream were everything that happens needs to be logged
 * @param {Function} callback Required callback. Signature: err, true/false
 */
Job.prototype.checkIfDependenciesNeedToBeReinstalled = function(out, callback) {
  var self = this;
  fs.readFile(Job.getRepoPath(self.name) + '/.gitignore', 'utf8', function (err, data) {
    var lines = data.split('\n')
      , nodeModulesIsGitignored = false;

    lines.forEach(function (line) {
      if (line.match(/^\/?node_modules\/?$/)) {
        nodeModulesIsGitignored = true;
      }
    });

    if (!nodeModulesIsGitignored) {
      out.write("=== node_modules is checked in Git so no need to reinstall them ===\n");
      return callback(null, false);
    }

    customUtils.checkIfFilesAreIdentical(Job.getDependenciesInfoDir(self.name) + '/npm-shrinkwrap.json', Job.getRepoPath(self.name) + '/npm-shrinkwrap.json', function (err, sameN) {
      if (err) { return callback(err); }
      customUtils.checkIfFilesAreIdentical(Job.getDependenciesInfoDir(self.name) + '/package.json', Job.getRepoPath(self.name) + '/package.json', function (err, sameP) {
        if (err) { return callback(err); }
        if (sameN && sameP) {
          out.write("=== node_modules is gitignored but package.json and npm-shrinkwrap.json didn't change, no need to reinstall ===\n");
          return callback(null, false);
        } else {
          out.write("=== node_modules is gitignored and package.json or npm-shrinkwrap.json changed, we need to reinstall ===\n");
          return callback(null, true);
        }
      });
    });
  });
};


/**
 * (Re)install the dependencies
 * @param {WritableStream} out Stream were everything that happens needs to be logged
 * @param {Function} callback Required callback
 */
Job.prototype.reinstallDependencies = function (out, callback) {
  var self = this, installer;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  async.waterfall([
    function (cb) {   // Reinstall
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
  ], callback);
};


/**
 * Run the tests
 * @param {WritableStream} out Stream were everything that happens needs to be logged
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
 * Advertise the result of a build on hipchat
 */
Job.prototype.advertiseOnHipchat = function (buildSuccessful) {
  var messageToSend = { room_id: 'Deployment'
                      , from: 'Braindead CI'
                      , message_format: 'html'
                      , notify: buildSuccessful ? 0 : 1
                      , color: buildSuccessful ? 'green' : 'red'
                      }
    , buildUrl = config.braindeadRootUrl + '/jobs/' + this.name + '/builds/' + this.nextBuildNumber;
    ;

  if (buildSuccessful) {
    messageToSend.message = this.name + ' - Build and deploy successful (<a href="' + buildUrl + '">see build</a>)';
  } else {
    messageToSend.message = this.name + ' - Build and deploy failed (<a href="' + buildUrl + '">see build</a>)';
  }

  customUtils.sendMessageToHipchat(messageToSend);
};


/**
 * Copy the dependencies files (npm-shrinkwrap.json and package.json) so that
 * For the next build we can compare them against the current versions and know
 * if we need to reinstall the dependencies.
 */
Job.prototype.copyDependenciesFiles = function (callback) {   // Copy dependency files to remember them next time we check if need to reinstall
  var self = this;

  customUtils.ensureFolderExists(Job.getDependenciesInfoDir(self.name), function (err) {
    if (err) { return callback(err); }
    customUtils.copySafe(Job.getRepoPath(self.name) + '/npm-shrinkwrap.json', Job.getDependenciesInfoDir(self.name) + '/npm-shrinkwrap.json', function (err) {
      if (err) { return callback(err); }
      customUtils.copySafe(Job.getRepoPath(self.name) + '/package.json', Job.getDependenciesInfoDir(self.name) + '/package.json', function (err) {
        return callback(err);
      });
    });
  });
}


/**
 * Launch a build
 */
Job.prototype.build = function (out, callback) {
  var self = this
    , buildReport
    , channel = new customUtils.PassthroughStream()   // Used to centralize build outputs
    , needToReinstallDeps = false
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
          if (err) { buildReport.write("Couldn't pull the repository, error given: " + err + "\n"); }
          cb(err);
        });
      }
    , function (cb) {
      channel.write("=== Checking if we need to reinstall dependencies ===\n");
      self.checkIfDependenciesNeedToBeReinstalled(channel, function (err, need) {
        if (err) { channel.write("=== Problem while checking if we need to reinstall dependencies, error given: " + err + "\n"); return cb(err); }
        needToReinstallDeps = need;
        return cb();
      });
    }
    , function (cb) {
      if (!needToReinstallDeps) { return cb(); }
      channel.write("=== Reinstalling dependencies ===\n");
      self.reinstallDependencies(channel, function (err) {
        if (err) { channel.write("=== Problem reinstalling dependencies, error given: " + err + "\n"); }
        cb(err);
      });
    }
    , function (cb) {
      channel.write("=== Running tests ===\n");
      var script = "cd " + Job.getRepoPath(self.name).replace(/ /g, '\\ ') + ";" + self.testScript;

      customUtils.executeBashScript(script, null, channel, function (err) {
        if (err) { channel.write("=== Tests didn't pass, error given: " + err + "\n"); }
        cb(err);
      });
    }
    , function (cb) {
      channel.write("=== Deploying ===\n");
      customUtils.executeBashScript(self.deployScript, { REINSTALL_DEPS: needToReinstallDeps }, channel, function (err) {
        return cb(err);
      });
    }
    , function (cb) {
      self.copyDependenciesFiles(function (err) { cb(err); });
    }
    ], function (err) {
      var buildSuccessful = err ? false : true;

      if (buildSuccessful) {
        channel.write("=== YES! Build and deploy successful! ===\n");
      } else {
        channel.write("=== OH NOES! Something went wrong :( ===\n");
      }

      buildReport.end();
      self.advertiseOnHipchat(buildSuccessful);   // Asynchronously advertise build
      self.previousBuilds[self.nextBuildNumber] = { number: self.nextBuildNumber
                                                  , success: buildSuccessful
                                                  , date: new Date()
                                                  };
      self.nextBuildNumber += 1;
      self.save(function (err) { if (err) { return callback(err); } });
    });
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
