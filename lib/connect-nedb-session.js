/**
 * Session store for Connect/Express, backed by nedb
 */
var Nedb = require('nedb');


module.exports = function (connect) {
  /**
   * Constructor
   * @param {String} options.filename File where session data will be persisted
   */
  function NedbStore(options) {
    this.filename = options.filename;
    this.db = new Nedb(options.filename);
    this.db.loadDatabase();   // Asynchronous but very quick
  }

  // Inherit from Connect's session store
  NedbStore.prototype.__proto__ = connect.session.Store.prototype;


  /**
   * Get session data
   */
  NedbStore.prototype.get = function (sid, callback) {
    this.db.findOne({ sid: sid }, function (err, sess) {
      if (err) { return callback(err); }
      if (!sess) { return callback(null, null); }

      return callback(null, sess.data);
    });
  };


  /**
   * Set session data
   */
  NedbStore.prototype.set = function (sid, data, callback) {
    this.db.update({ sid: sid }, { sid: sid, data: data }, { multi: false, upsert: true }, function (err, ne, up) {
      return callback(err);
    });
  };


  /**
   * Destroy a session's data
   */
  NedbStore.prototype.destroy = function (sid, callback) {
    this.db.remove({ sid: sid }, { multi: false }, function (err) {
      return callback(err);
    });
  };


  return NedbStore;
};
