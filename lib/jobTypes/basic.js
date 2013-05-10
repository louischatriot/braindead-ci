/**
 * Basic build steps, common to all jobs
 * To be added to a job's prototype
 */
var fs = require('fs')
  , async = require('async')
  , childProcess = require('child_process')
  , customUtils = require('../customUtils')
  ;


/**
 * Populates a job's building sequence
 */
function populateBuildingSequence (job) {
  var buildAndTest = job.repoSSHUrl && job.repoSSHUrl.length > 0 &&   // If no branch or repoSSHUrl is provided, that means the user doesn't want
                     job.branch && job.branch.length > 0              // to use the CI capability but just execute the deploy script
   , buildSequence = [];

  if (buildAndTest) {
    buildSequence.push(pullRepo.bind(job));
    buildSequence.push(checkIfDependenciesNeedToBeReinstalled.bind(job));
    buildSequence.push(runTestScript.bind(job));
  }

  buildSequence.push(runDeployScript.bind(job));

  job.buildSequence = buildSequence;
}


/**
 * Pull the repo, and create it if it doesn't exist
 * @param {Function} callback Required callback, signature: err
 */
function pullRepo (callback) {
  var self = this
    , Job = self.constructor
    ;

  self.buildingSandbox.channel.write("=== Pulling new code ===\n");

  async.waterfall([
    function (cb) {   // Ensure the repo exists, create it if needed
      customUtils.ensureDirectoryExists(Job.getRepoPath(self.name), function (err) {
        if (err) { return cb(err); }

        fs.readdir(Job.getRepoPath(self.name), function (err, files) {
          if (err) { return cb(err); }
          if (files.length > 0) { return cb(); }   // Files were found, we assume it's a Git repo.

          childProcess.exec('git clone ' + self.repoSSHUrl + ' .', {  cwd: Job.getRepoPath(self.name)  }, function (err, stdout, stderr) {
            self.buildingSandbox.channel.write("=== First build, cloning the repository ===\n");
            self.buildingSandbox.channel.write(stdout);
            self.buildingSandbox.channel.write(stderr);
            return cb(err);
          })
        });
      });
    }
  , function (cb) {   // Pull it (will fail if branch doesn't exist)
      childProcess.exec('set -e; git checkout ' + self.branch + '; git pull', {  cwd: Job.getRepoPath(self.name)  }, function (err, stdout, stderr) {
        self.buildingSandbox.channel.write(stdout);
        self.buildingSandbox.channel.write(stderr);
        return cb(err);
      })
    }
  ], callback);
}


/**
 * Check if we need to reinstall the dependencies, that's what takes most of the build time
 * For a basic (i.e. all-purpose) job type, we know nothing about the language/framework used
 * so we assume we always need to reinstall the dependencies.
 * @param {Function} callback Required callback. Signature: err
 */
function checkIfDependenciesNeedToBeReinstalled (callback) {
  var self = this
    , Job = self.constructor
    ;

  self.buildingSandbox.channel.write("=== Basic job type: language/framework unknown so assume we need to reinstall the dependencies ===\n");
  self.buildingSandbox.channel.write("=== Don't forget to reinstall your dependencies in your test and deployment scripts otherwise ===\n");
  self.buildingSandbox.channel.write("=== tests will most likely fail every time you use a new dependency ===\n");
  self.buildingSandbox.needToReinstallDependencies = true;
  return callback();
}


/**
 * Run the test script
 * @param {Function} callback Required callback, signature: err
 */
function runTestScript (callback) {
  var self = this
    , Job = self.constructor
    ;

  self.buildingSandbox.channel.write("=== Running test script ===\n");
  var script = "cd " + Job.getRepoPath(self.name).replace(/ /g, '\\ ') + ";" + self.testScript;
  customUtils.executeBashScript(script, null, self.buildingSandbox.channel, callback);
}


/**
 * Run the deploy script
 * @param {Function} callback Required callback, signature: err
 */
function runDeployScript (callback) {
  var self = this
    , Job = self.constructor
    ;

  self.buildingSandbox.channel.write("=== Running deployment script ===\n");
  customUtils.executeBashScript(self.deployScript, { REINSTALL_DEPS: self.buildingSandbox.needToReinstallDependencies }, self.buildingSandbox.channel, callback);
}

module.exports = { populateBuildingSequence: populateBuildingSequence, name: 'Basic' };

