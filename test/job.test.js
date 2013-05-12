var should = require('chai').should()
  , assert = require('chai').assert
  , db = require('../lib/db')
  , config = require('../lib/config')
  , Job = require('../lib/job')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , async = require('async')
  , app = require('../app')
  ;


describe.only('Job', function () {
  before(function (done) {
    app.init(done);
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

  it('Can create a job with default args, persist to the database and create root directory', function (done) {
    var jobData = { name: 'test'
                  , jobType: 'Basic'
                  , githubRepoUrl: 'gru'
                  , repoSSHUrl: 'rsu'
                  , branch: 'b'
                  , testScript: 'ts'
                  , deployScript: 'ds'
                  };

    function testJob (job) {
      job.name.should.equal('test');
      job.jobType.should.equal('Basic');
      job.githubRepoUrl.should.equal('gru');
      job.repoSSHUrl.should.equal('rsu');
      job.branch.should.equal('b');
      job.testScript.should.equal('ts');
      job.deployScript.should.equal('ds');
      job.nextBuildNumber.should.equal(1);
      job.enabled.should.equal(true);
      Object.keys(job.previousBuilds).length.should.equal(0);
    }

    db.jobs.findOne({ name: 'test' }, function (err, job) {
      assert.isNull(err);
      assert.isNull(job);

      fs.exists(Job.getRootDir('test'), function (exists) {
        exists.should.equal(false);

        Job.createJob(jobData, function (err, job) {
          assert.isNull(err);

          // Returned job is the expected one
          testJob(job);

          // Root directory was created
          fs.exists(Job.getRootDir('test'), function (exists) {
            exists.should.equal(true);

            db.jobs.findOne({ name: 'test' }, function (err, job) {
              assert.isNull(err);
              testJob(job);

              done();
            });
          });
        });
      })
    });
  });

});
