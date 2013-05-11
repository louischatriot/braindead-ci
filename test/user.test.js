var should = require('chai').should()
  , assert = require('chai').assert
  , db = require('../lib/db')
  , User = require('../lib/user')
  ;

describe('User', function () {

  beforeEach(function (done) {
    db.initialize(function (err) {
      if (err) { return done(err); }
      db.users.remove({}, function (err) { return done(err); });
    });
  });

  it('Can check whether the user db is empty', function (done) {
    User.getAllUsers(function (err, users) {
      users.length.should.equal(0);
      User.userDbEmpty(function (empty) {
        empty.should.equal(true);

        User.createUser({ login: 'test', password: 'secretpassword' }, function () {
          User.userDbEmpty(function (empty) {
            empty.should.equal(false);

            done();
          });
        });
      });
    });
  });

});
