/**
 * Manage datastores
 * We chose nStore since it is a stand-alone data store for node.js (similar to SQLite)
 * That way, we avoid the need to install a third-party DB
 */

var nStore = require('nstore')
  , config = require('./config')
  , async = require('async')
  , db = {}
  ;

/**
 * Look for objects as if we were using Mongoose
 * The key will be stored in an '_id' field
 */
function myFind (query, callback) {
  function arrayifyResults (obj) {
    var res = [];

    Object.keys(obj).forEach(function (k) {
      var doc = obj[k];
      doc._id = k;
      res.push(doc);
    });

    return res;
  }

  // Don't fail if there is no filter in the query!
  if (Object.keys(query).length === 0) {
    this.all(function (err, docs) {
      if (err) { return callback(err); }

      return callback(null, arrayifyResults(docs));
    });
    return;
  }

  this.find(query, function (err, docs) {
      if (err) { return callback(err); }

      return callback(null, arrayifyResults(docs));
  });
}


// Use the Query plugin and my finding function (modeled on Mongoose's)
nStore = nStore.extend(require('nstore/query')());
nStore = nStore.extend();
nStore = nStore.extend({ myFind: myFind });


/**
 * Initialize all data stores (for now only jobs)
 */
db.initialize = function (cb) {
  var callback = cb || function () {}
    , dbNames = ['jobs'];

  async.each( dbNames
  , function (name, cb) {
    db[name] = nStore.new(config.workspace + '/_data/' + name + '.db', function (err) { return cb(err); });
  }
  , function (err) {
    if (err) { return callback(err); }
    delete db.initialize;   // We don't need it anymore and we want db to only contain the collections
    return callback();
  });
};


// Export the databases and the init function
module.exports = db;
