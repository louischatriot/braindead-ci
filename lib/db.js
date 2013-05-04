/**
 * Manage datastores
 * We chose nStore since it is a stand-alone data store for node.js (similar to SQLite)
 * That way, we avoid the need to install a third-party DB
 */

var Nedb = require('nedb')
  , config = require('./config')
  , async = require('async')
  , db = {}
  ;


/**
 * Initialize all data stores (for now only jobs)
 */
db.initialize = function (cb) {
  var callback = cb || function () {}
    , dbNames = ['jobs'];

  async.each( dbNames
  , function (name, cb) {
    db[name] = new Nedb(config.workspace + '/_data/' + name + '.db');
    db[name].loadDatabase(cb);
  }
  , function (err) {
    if (err) { return callback(err); }
    delete db.initialize;   // We don't need it anymore and we want db to only contain the collections
    return callback();
  });
};


// Export the databases and the init function
module.exports = db;
