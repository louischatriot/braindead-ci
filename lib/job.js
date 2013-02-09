/**
 * A job takes care of a branch on a repo.
 * Its config is stored in workspace/name_of_job.js
 * The corresponding Git repo used for tests is workspace/name_of_job
 *
 */
var config = require('./config')
  , fs = require('fs')
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

  fs.writeFile(Job.getConfigPath(this.name), data, 'utf8', callback);
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
 * Returns where the config file for job named 'name' is stored
 */
Job.getConfigPath = function (name) {
  return config.workspace + '/' + name;
};


//var j = new Job({ name: 'test', repo: 'giiiit', branch: 'thebranch' });
//j.save();
//Job.loadConfig('test', function (err, config) {
//console.log(config);
//});

module.exports = Job;
