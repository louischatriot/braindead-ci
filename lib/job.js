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
  , async = require('async')
  , rimraf = require('rimraf')
  , db = require('./db')
  , basicSteps = require('./jobTypes/basic.js')
  , request = require('request')
  ;



// =============================================================
// Job creation, edition, deletion
// =============================================================

function Job (jobData) {
  var keys = Object.keys(jobData)
    , i, self = this;

  // Give the job its basic properties (settings)
  Job.propertiesToSave().forEach(function (prop) {
    self[prop] = jobData[prop];
  });

  // Populate the job's build sequence
  basicSteps(self);
}


/**
 * Get the fields we want to persist (don't save extraneous data)
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
 * Create a new job
 */
Job.createJob = function (jobData, callback) {
  jobData.nextBuildNumber = 1;
  jobData.previousBuilds = {};
  jobData.enabled = true;
  j = new Job(jobData);

  // Persist job to the database and create its root directory
  customUtils.ensureDirectoryExists(Job.getRootDir(j.name), function (err) {
    if (err) { return callback(err); }

    j.save(function (err) {
      return callback(err, j);
    });
  });
}


/**
 * Get a job object from the DB data
 */
Job.getJob = function (name, callback) {
  if (!name) { return callback("This job doesn't have a name"); }

  db.jobs.findOne({ name: name }, function (err, jobData) {
    if (err) { return callback (err); }
    if (!jobData) { return callback('Job ' + name + ' not found!'); }

    return callback(null, new Job(jobData));
  });
};


/**
 * Save job data in the database
 * Can be used to save an already existing or a newly created job
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
  registerValidator('githubRepoUrl', validation.accept, '');
  registerValidator('repoSSHUrl', validation.accept, '');
  registerValidator('branch', validation.accept, '');
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
// Job building and advertising
// ==================================================

/**
 * Advertise build results
 * Manages all channels
 * buildSuccessful can have 4 values:
 * * true means the build was successful
 * * false means it failed
 * * null and undefined mean the job wasn't built
 */
Job.prototype.advertiseBuildResult = function (buildSuccessful) {
  this.advertiseOnHipchat(buildSuccessful);
};


/**
 * Advertise the result of a build on hipchat
 */
Job.prototype.advertiseOnHipchat = function (buildSuccessful) {
  var messageToSend = { from: 'Braindead CI'
                      , message_format: 'html'
                      }
    , self = this
    , buildUrl = config.braindeadRootUrl + '/jobs/' + self.name + '/builds/' + self.nextBuildNumber
    , uri = "https://api.hipchat.com/v1/rooms/message?format=json&auth_token="
    ;

  db.settings.findOne({ type: 'generalSettings' }, function (err, settings) {
    if (err || !settings || !customUtils.settingDefined(settings.hipchatToken) || !customUtils.settingDefined(settings.hipchatRoom)) {
      return;
    }

    messageToSend.room_id = settings.hipchatRoom;

    if (buildSuccessful === null || buildSuccessful === undefined) {
      messageToSend.notify = 0;
      messageToSend.color = 'gray';
      messageToSend.message = self.name + " was not built since it's in disabled state";
    }

    if (buildSuccessful === true) {
      messageToSend.notify = 0;
      messageToSend.color = 'green';
      messageToSend.message = self.name + ' - Build and deploy successful (<a href="' + buildUrl + '">see build</a>)';
    }

    if (buildSuccessful === false) {
      messageToSend.notify = 1;
      messageToSend.color = 'red';
      messageToSend.message = self.name + ' - Build and deploy failed (<a href="' + buildUrl + '">see build</a>)';
    }

    uri += settings.hipchatToken;
    Object.keys(messageToSend).forEach(function (k) {
      uri += '&' + k + '=' + encodeURIComponent(messageToSend[k]);
    });
    request.get({ headers: {"Accept": "application/json"}, uri: uri}, function () {});
  });
};


/**
 * Launch a build
 * @param {WritableStream} out A stream provided by the build initiator. Can be process.stdout or Http.ServerResponse for example.
 * @param {Function} callback Signature: err
 */
Job.prototype.build = function (out, callback) {
  var self = this
    , buildReport
    ;

  self.buildingSandbox = {};   // Usable by the build steps to store and pass data during a build
  self.buildingSandbox.channel =  new customUtils.PassthroughStream();

  customUtils.ensureDirectoryExists(Job.getBuildsDir(this.name), function (err) {
    if (err) { return callback(err); }
    buildReport = fs.createWriteStream(Job.getBuildFilename(self.name, self.nextBuildNumber));
    out && self.buildingSandbox.channel.pipe(out);
    self.buildingSandbox.channel.pipe(buildReport);

    async.waterfall(self.buildSequence, function (err) {
      var buildSuccessful = err ? false : true;

      if (buildSuccessful) {
        self.buildingSandbox.channel.write("=== YES! Build and deploy successful! ===\n");
      } else {
        self.buildingSandbox.channel.write("=== OH NOES! Something went wrong :( ===\n");
        self.buildingSandbox.channel.write(err);
      }

      buildReport.end();
      self.advertiseBuildResult(buildSuccessful);   // Asynchronously advertise build
      self.previousBuilds[self.nextBuildNumber] = { number: self.nextBuildNumber
                                                  , success: buildSuccessful
                                                  , date: new Date()
                                                  };
      self.nextBuildNumber += 1;
      self.save(function (err) { return callback(err); });
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
