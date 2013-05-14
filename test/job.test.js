var should = require('chai').should()
  , assert = require('chai').assert
  , db = require('../lib/db')
  , config = require('../lib/config')
  , Job = require('../lib/job')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , async = require('async')
  , app = require('../braindead')
  ;


describe('Job', function () {
  var jobData;

  before(function (done) {
    app.init(done);
  });

  beforeEach(function (done) {
    db.jobs.remove({}, function (err) {
      if (err) { return done(err.toString()); }

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

  // Sample jobData and function to test a job corresponds to this data
  jobData = { name: 'test'
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

  it('Can create a job with default args, persist to the database and create root directory', function (done) {
    db.jobs.findOne({ name: 'test' }, function (err, job) {
      if (err) { return done(err.toString()); }
      assert.isNull(job);

      fs.exists(Job.getRootDir('test'), function (exists) {
        exists.should.equal(false);

        Job.createJob(jobData, function (err, job) {
          if (err) { return done(err.toString()); }

          // Returned job is the expected one
          testJob(job);

          // Root directory was created
          fs.exists(Job.getRootDir('test'), function (exists) {
            exists.should.equal(true);

            db.jobs.findOne({ name: 'test' }, function (err, job) {
              if (err) { return done(err.toString()); }
              testJob(job);

              done();
            });
          });
        });
      })
    });
  });

  it('Can get a job by its name', function (done) {
    Job.createJob(jobData, function () {
      Job.getJob('testy', function (err, job) {
        if (err) { return done(err.toString()); }
        assert.isNull(job);

        Job.getJob('test', function (err, job) {
          if (err) { return done(err.toString()); }
          testJob(job);

          done();
        });
      });
    });
  });

  it('Can remove a job', function (done) {
    Job.createJob(jobData, function () {
      Job.getJob('test', function (err, job) {
        assert.isDefined(job);

        // Can't remove it if wrong name is used
        Job.removeJob('testy', function (err) {
          assert.isDefined(err);
          Job.getJob('test', function (err, job) {
            assert.isDefined(job);
            fs.exists(Job.getRootDir('test'), function (exists) {
              exists.should.equal(true);

              // Remove it if correct name is used
              Job.removeJob('test', function (err) {
                if (err) { return done(err.toString()); }
                Job.getJob('test', function (err, job) {
                  if (err) { return done(err.toString()); }
                  assert.isNull(job);
                  fs.exists(Job.getRootDir('test'), function (exists) {
                    exists.should.equal(false);

                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('Can modify a job name (other edits are straightforward)', function (done) {
    Job.createJob({ name: 'test' }, function (err, job) {
      if (err) { return done(err.toString()); }
      assert.isDefined(job);
      fs.exists(Job.getRootDir('test'), function (exists) {
        exists.should.equal(true);
        fs.exists(Job.getRootDir('another'), function (exists) {
          exists.should.equal(false);

          // Job 'test' is now 'another' and the root dir has changed name accordingly
          // Need to get the job from the DB to retrieve the _id (createJob gives a cached copy)
          Job.getJob('test', function (err, job) {
            job.edit({ name: 'another' }, function (err) {
              Job.getJob('test', function (err, job) {
                assert.isNull(job);
                Job.getJob('another', function (err, job) {
                  job.name.should.equal('another');
                  fs.exists(Job.getRootDir('test'), function (exists) {
                    exists.should.equal(false);
                    fs.exists(Job.getRootDir('another'), function (exists) {
                      exists.should.equal(true);

                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

});
