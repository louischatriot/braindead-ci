var should = require('chai').should()
  , assert = require('chai').assert
  , db = require('../lib/db')
  , User = require('../lib/user')
  ;

describe('User', function () {

  before(function (done) {
    if (!db.initialize) { return done(); }   // Already initialized
    db.initialize(done);
  });

  beforeEach(function (done) {
    db.users.remove({}, function (err) { return done(err); });
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

  it('Can create a user and encrypt his password', function (done) {
    var userData = { login: 'test', password: 'supersecret' };

    User.userDbEmpty(function (empty) {
      empty.should.equal(true);

      User.createUser(userData, function (err, newUser) {
        newUser.login.should.equal('test');
        assert.isDefined(newUser.password.salt);
        newUser.password.derivedKey.should.not.equal('supersecret');

        done();
      });
    });
  });

  it('Wont validate if login or password is not present or too short', function () {
    assert.isDefined(User.validate({ login: 'coolLogin' }).validationErrors.password);
    assert.isDefined(User.validate({ password: 'coolPassword' }).validationErrors.login);
    assert.isDefined(User.validate({ login: 'co', password: 'coolPassword' }).validationErrors.login);
    assert.isDefined(User.validate({ login: 'coolLogin', password: 'short' }).validationErrors.password);

    assert.isNull(User.validate({ login: 'coolLogin', password: 'coolPassword' }));
  });

  it('Wont create a user if it doesnt validate or login is already taken', function (done) {
    var userData = { login: 'again', password: 'short' };

    User.createUser(userData, function (err) {
      assert.isDefined(err.validationErrors.password);

      userData.password = 'supersecret';
      User.createUser(userData, function (err) {
        assert.isNull(err);

        User.createUser(userData, function (err) {
          assert.isDefined(err.validationErrors.login);

          done();
        });
      });
    });
  });

  it('Can get a user by his login', function (done) {
    var userData = { login: 'test', password: 'supersecret' };

    User.getUser('test', function (err, user) {
      assert.isNull(err);
      assert.isNull(user);

      User.createUser(userData, function (err, newUser) {

        User.getUser('test', function (err, user) {
          assert.isNull(err);
          user.login.should.equal('test');

          done();
        });
      });
    });
  });

  it('Can remove a user from the database', function (done) {
    var userData = { login: 'test', password: 'supersecret' };

    User.createUser(userData, function (err, newUser) {

      User.getUser('test', function (err, user) {
        assert.isNull(err);
        user.login.should.equal('test');

        User.removeUser('test', function (err) {
          assert.isNull(err);

          // User has been removed
          User.getUser('test', function (err, user) {
            assert.isNull(err);
            assert.isNull(user);

            // Trying to remove him again will raise an error
            User.removeUser('test', function (err) {
              assert.isDefined(err);

              done();
            });
          });
        });
      });
    });
  });

  it('Can check a users credential and return him if credentials are good', function (done) {
    var userData = { login: 'test', password: 'supersecret' };

    User.createUser(userData, function (err, newUser) {
      // Bad login
      User.checkCredentials('another', 'supersecret', function (err) {
        assert.isDefined(err.validationErrors.userNotFound);

        // Bad password
        User.checkCredentials('test', 'wrongpassword', function (err) {
          assert.isDefined(err.validationErrors.wrongPassword);

          // Works
          User.checkCredentials('test', 'supersecret', function (err, user) {
            assert.isNull(err);
            user.login.should.equal('test');

            done();
          });
        });
      });
    });
  });

  it('Can change a users password if the current password is provided', function (done) {
    var userData = { login: 'test', password: 'supersecret' };

    User.createUser(userData, function (err, newUser) {
      // Bad login
      User.changePassword('another', 'supersecret', 'changedpassword', function (err) {
        assert.isDefined(err);

        // Bad current passworrd
        User.changePassword('test', 'wrongone', 'changedpassword', function (err) {
          assert.isDefined(err);

          // New password doesnt validate
          User.changePassword('test', 'supersecret', 'short', function (err) {
            assert.isDefined(err);

            // It works
            User.changePassword('test', 'supersecret', 'changedpassword', function (err) {
              assert.isNull(err);

              User.checkCredentials('test', 'supersecret', function (err) {
                assert.isDefined(err);

                User.checkCredentials('test', 'changedpassword', function (err, user) {
                  assert.isDefined(err);
                  user.login.should.equal('test');

                  done();
                });
              });
            });
          });
        });
      });
    });
  });

});   // ==== End of 'User' ==== //



