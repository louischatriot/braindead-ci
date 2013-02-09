/**
 * A job takes care of a branch on a repo.
 * Its config is stored in workspace/name_of_job.js
 * The corresponding Git repo used for tests is workspace/name_of_job
 *
 */
var config = require('./config');


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
Job.prototype.save = function () {
  var data = "{ name: '" + this.name + "'\n";

  function addProperty(obj, prop) { data += ", " + prop + ": " + obj[prop] + "\n"; }
  addProperty(this, 'repo');
  addProperty(this, 'branch');

  data += "}";

  console.log(data);
};




/**
 * Try to load a job from the filesystem
 */
Job.loadFromFile = function (name, callback) {
  fs.exists(config.workspace + '/' + name, function (exists) {
    if (!exists) { return callback(); }

    fs.readFile(config.workspace + '/' + name, 'utf8', function (err, data) {
      var f;
      if (err) { return callback(err); }

      f = new Function('return ' + data);
      return new Job(f());
    });
  });
};




module.exports = Job;
