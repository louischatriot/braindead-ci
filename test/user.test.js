var should = require('chai').should()
  , assert = require('chai').assert
  , db = require('../lib/db')
  , User = require('../lib/user')
  ;

describe('User', function () {

  before(function (done) {
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

});
