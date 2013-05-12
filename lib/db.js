/**
 * Manage datastores
 * We chose nedb since it is a stand-alone data store for node.js (similar to SQLite)
 * That way, we avoid the need to install a third-party DB
 */

var Nedb = require('nedb')
  , config = require('./config')
  , async = require('async')
  , db = {}
  ;


/**
 * Initialize all data stores
 */
db.initialize = function (cb) {
  var callback = cb || function () {}
    , dbNames = ['jobs', 'settings', 'users'];

  async.each( dbNames
  , function (name, cb) {
    db[name] = new Nedb(config.dbRootUrl + name + '.db');
    db[name].loadDatabase(cb);
  }
  , function (err) {
    if (err) { return callback(err); }
    return callback();
  });
};


// Export the databases and the init function
module.exports = db;
