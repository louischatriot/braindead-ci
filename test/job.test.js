var should = require('chai').should()
  , assert = require('chai').assert
  , db = require('../lib/db')
  , config = require('../lib/config')
  , Job = require('../lib/job')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , async = require('async')
  ;


describe.only('Job', function () {
  before(function (done) {
    if (!db.initialize) { return done(); }   // Already initialized
    db.initialize(done);
  });

  beforeEach(function (done) {
    db.jobs.remove({}, function (err) {
      if (err) { return done(err); }

      // Make sure these tests jobs directories are removed
      var jobsToRemove = ['test', 'another', 'again'];

      async.each(jobsToRemove, function (name, cb) {
        fs.exists(Job.getRootDir(name), function (exists) {
          if (!exists) { return cb(); }
          rimraf(Job.getRootDir(name), function (err) { return cb(err); });
        });
      }, done);
    });
  });

  it('Dummy', function (done) {
    done();
  });

});
