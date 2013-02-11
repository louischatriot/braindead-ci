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
Job.prototype.reinstallDependencies = function (callback) {
  var self = this;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  childProcess.exec('set -e; rm -rf node_modules; npm install', { cwd: Job.getRepoPath(self.name) }, function (err, stdout, stderr) {
    callback(err);
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

  outs.forEach(function (out) {
    tester.stdout.pipe(out);
  });

  tester.on('exit', function (code) {
    var error = code === 0 ? null : 'Tests failed';
    callback(error);
  });
};


/**
 * Launch a build
 */
Job.prototype.build = function (outs, callback) {
  var self = this
    , buildReport
    ;

  customUtils.ensureFolderExists(Job.getBuildsDir(this.name), function (err) {
    if (err) { return callback(err); }
    buildReport = fs.createWriteStream(Job.getBuildsDir(self.name) + '/build' + self.nextBuildNumber + '.log');

    self.nextBuildNumber += 1;
    self.save(function (err) {
      if (err) { return callback(err); }

      buildReport.write('Bloup');
      buildReport.write('Blap');

      buildReport.end();

      callback();
    });
  });
};


/**
 * Recreate a job from the filesystem save
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
  options.nextBuildNumber += 1;
  j = new Job(options);
  j.save(function (err) {
    return callback(err, j);
  });
}


/**
 * Save job state in its config file
 */
Job.prototype.save = function (callback) {
  var data, self = this;

  if (! this.name) { return callback("This job doesn't seem to have a name ..."); }

  // Create the js object to be persisted
  function addProperty(obj, prop) {
    if (obj[prop]) {
      if (typeof obj[prop] === 'string') { data += ", " + prop + ": '" + obj[prop] + "'\n"; }
      if (typeof obj[prop] === 'number') { data += ", " + prop + ": " + obj[prop] + "\n"; }
    }
  }
  data = "{ name: '" + this.name + "'\n";
  addProperty(this, 'repo');
  addProperty(this, 'branch');
  addProperty(this, 'nextBuildNumber');
  data += "}";

  customUtils.ensureFolderExists(config.workspace, function (err) {
    if (err) { return callback(err); }
    fs.writeFile(Job.getConfigPath(self.name), data, 'utf8', callback);
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
Job.getConfigPath = function (name) {
  return config.workspace + '/' + name + '/' + name + '.conf';
};

Job.getRepoPath = function (name) {
  return config.workspace + '/' + name + '/repo';
};

Job.getBuildsDir = function (name) {
  return config.workspace + '/' + name + '/builds';
};





var testJob = { name: 'api'
              , repo: 'git@github.com:tldrio/tldr-api.git'
              , branch: 'master'
              };


Job.getJob('api', function (err, job) {
  console.log("=============");
  console.log(err);
  console.log(job);

  job.build(null, function (err) {
    console.log("=============");
    console.log(err);
  });
});




module.exports = Job;
