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
 * Look for objects, same API as Mongoose
 * The key will be stored in the '_id' field
 */
function myFind (query, callback) {
  function arrayifyResults (err, obj) {
    if (err) { return callback(err); }

    var res = [];
    Object.keys(obj).forEach(function (k) {
      var doc = obj[k];
      doc._id = k;
      res.push(doc);
    });

    return callback(null, res);
  }

  // Don't fail if there is no filter in the query!
  if (!query || Object.keys(query).length === 0) {
    this.all(arrayifyResults);
  } else {
    this.find(query, arrayifyResults);
  }
}


/**
 * Look for one object, same API as Mongoose
 * The key is stored in the '_id' field
 * For now, very naive implementation (return the first found object after having iterated on the whole collection) ...
 */
function myFindOne(query, callback) {
  this.myFind(query, function (err, docs) {
    if (err) { return callback(err); }

    if (docs.length === 0) { return callback(null, null); }

    return callback(null, docs[0]);
  });
}


// Use the Query plugin and my finding function (modeled on Mongoose's)
nStore = nStore.extend(require('nstore/query')());
nStore = nStore.extend();
nStore = nStore.extend({ myFind: myFind, myFindOne: myFindOne });


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
