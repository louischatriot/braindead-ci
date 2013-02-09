/**
 * A job takes care of a branch on a repo.
 * Its config is stored in workspace/name_of_job.js
 * The corresponding Git repo used for tests is workspace/name_of_job
 *
 */
var config = require('./config')
  , fs = require('fs')
  , customUtils = require('./customUtils')
  ;


/**
 * Create a new job
 */
function Job (options) {
  var name = options.name
    , repo = options.repo
    , branch = options.branch || 'master'
    ;

  if (!name) {
    return false;   // TODO: Use a callback ?
  }

  this.name = name;
  this.repo = repo;
  this.branch = branch;
}


/**
 * Pull the repo, and create it if it doesn't exist
 */
Job.prototype.pullRepo = function () {
  var self = this;

  if (! this.name) { return callback({ error: "This job doesn't seem to have a name ..." }); }

  customUtils.ensureFolderExists(Job.getRepoPath(this.name), function (err) {
    if (err) { return callback(err); }


  });
};


/**
 * Save job state in its config file
 */
Job.prototype.save = function (callback) {
  var data;

  if (! this.name) { return callback({ error: "This job doesn't seem to have a name ..." }); }

  // Create the js object to be persisted
  function addProperty(obj, prop) { data += ", " + prop + ": '" + obj[prop] + "'\n"; }
  data = "{ name: '" + this.name + "'\n";
  addProperty(this, 'repo');
  addProperty(this, 'branch');
  data += "}";

  customUtils.ensureFolderExists(config.workspace, function (err) {
    if (err) { return callback(err); }
    fs.writeFile(Job.getConfigPath(this.name), data, 'utf8', callback);
  });
};


/**
 * Try to load a job from the filesystem
 */
Job.loadConfig = function (name, callback) {
  fs.exists(config.workspace + '/' + name, function (exists) {
    if (!exists) { return callback(); }

    fs.readFile(Job.getConfigPath(name), 'utf8', function (err, data) {
      var f, config;
      if (err) { return callback(err); }

      try {
        f = new Function('return ' + data);
        config = f();
        return callback(null, config);
      } catch (e) {
        return callback(e);
      }
    });
  });
};


/**
 * Functions defining where the data is stored
 */
Job.getConfigPath = function (name) {
  return config.workspace + '/' + name + '.conf';
};

Job.getRepoPath = function (name) {
  return config.workspace + '/' + name;
};


var j = new Job({ name: 'test'
                , homepage: 'https://github.com/louischatriot/test'
                , repo: 'git@github.com:louischatriot/test.git'
                , branch: 'master' });


//j.save();
//Job.loadConfig('test', function (err, config) {
//console.log(config);
//});

module.exports = Job;
