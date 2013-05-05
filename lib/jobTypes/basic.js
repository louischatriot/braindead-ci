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
 * Pull the repo, and create it if it doesn't exist
 * @param {WritableStream} out Stream were everything that happens is logged
 * @param {Function} callback Required callback, signature: err
 */
function pullRepo (out, callback) {
  var self = this
    , Job = self.constructor
    ;

  out && out.write("=== Pulling new code ===\n");

  async.waterfall([
    function (cb) {   // Ensure the repo exists, create it if needed
      customUtils.ensureDirectoryExists(Job.getRepoPath(self.name), function (err) {
        if (err) { return cb(err); }

        fs.readdir(Job.getRepoPath(self.name), function (err, files) {
          if (err) { return cb(err); }
          if (files.length > 0) { return cb(); }   // Files were found, we assume it's a Git repo.

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
}


/**
 * Check if we need to reinstall the dependencies, that's what takes most of the build time
 * @param {WritableStream} out Stream were everything that happens is logged
 * @param {Function} callback Required callback. Signature: err
 */
function checkIfDependenciesNeedToBeReinstalled (out, callback) {
  var self = this
    , Job = self.constructor
    ;

  fs.readFile(Job.getRepoPath(self.name) + '/.gitignore', 'utf8', function (err, data) {
    var lines = data.split('\n')
      , nodeModulesIsGitignored = false;

    out && out.write("=== Checking if we need to reinstall dependencies ===\n");

    lines.forEach(function (line) {
      if (line.match(/^\/?node_modules\/?$/)) {
        nodeModulesIsGitignored = true;
      }
    });

    if (!nodeModulesIsGitignored) {
      out.write("=== node_modules is checked in Git so no need to reinstall them ===\n");
      self.buildingSandbox.needToReinstallDependencies = false;
      return callback();
    }

    customUtils.checkIfFilesAreIdentical(Job.getDependenciesInfoDir(self.name) + '/npm-shrinkwrap.json', Job.getRepoPath(self.name) + '/npm-shrinkwrap.json', function (err, sameN) {
      if (err) { return callback(err); }
      customUtils.checkIfFilesAreIdentical(Job.getDependenciesInfoDir(self.name) + '/package.json', Job.getRepoPath(self.name) + '/package.json', function (err, sameP) {
        if (err) { return callback(err); }
        if (sameN && sameP) {
          out.write("=== node_modules is gitignored but package.json and npm-shrinkwrap.json didn't change, no need to reinstall ===\n");
          self.buildingSandbox.needToReinstallDependencies = false;
          return callback();
        } else {
          out.write("=== node_modules is gitignored and package.json or npm-shrinkwrap.json changed, we need to reinstall ===\n");
          self.buildingSandbox.needToReinstallDependencies = true;
          return callback();
        }
      });
    });
  });
}


/**
 * (Re)install the dependencies
 * @param {WritableStream} out Stream were everything that happens is logged
 * @param {Function} callback Required callback, signature: err
 */
function reinstallDependencies (out, callback) {
  var self = this, installer
    , Job = self.constructor
    ;

  if (! self.buildingSandbox.needToReinstallDependencies) { return callback(); }

  out && out.write("=== Reinstalling dependencies ===\n");

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
}


/**
 * Copy the dependencies files (npm-shrinkwrap.json and package.json) so that
 * For the next build we can compare them against the current versions and know
 * if we need to reinstall the dependencies.
 * @param {Function} callback Signature: err
 */
function rememberDependencies (callback) {   // Copy dependency files to remember them next time we check if need to reinstall
  var self = this
    , Job = self.constructor
    ;

  customUtils.ensureDirectoryExists(Job.getDependenciesInfoDir(self.name), function (err) {
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
 * Run the test script
 * @param {WritableStream} out Stream were everything that happens is logged
 * @param {Function} callback Required callback, signature: err
 */
function runTestScript (out, callback) {
  var self = this
    , Job = self.constructor
    ;

  out && out.write("=== Running test script ===\n");
  var script = "cd " + Job.getRepoPath(self.name).replace(/ /g, '\\ ') + ";" + self.testScript;
  customUtils.executeBashScript(script, null, out, callback);
}


/**
 * Run the deploy script
 * @param {WritableStream} out Stream were everything that happens is logged
 * @param {Function} callback Required callback, signature: err
 */
function runDeployScript (out, callback) {
  var self = this
    , Job = self.constructor
    ;

  out.write("=== Running deployment script ===\n");
  customUtils.executeBashScript(self.deployScript, { REINSTALL_DEPS: self.buildingSandbox.needToReinstallDependencies }, out, callback);
}



module.exports = { pullRepo: pullRepo
                 , checkIfDependenciesNeedToBeReinstalled: checkIfDependenciesNeedToBeReinstalled
                 , reinstallDependencies: reinstallDependencies
                 , rememberDependencies: rememberDependencies
                 , runTestScript: runTestScript
                 , runDeployScript: runDeployScript
                 };


