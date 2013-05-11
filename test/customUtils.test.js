var should = require('chai').should()
  , assert = require('chai').assert
  , customUtils = require('../lib/customUtils')
  , config = require('../lib/config')
  ;

describe('Custom utils', function () {

  describe('#uid', function () {

    it('Gives a string of length len', function () {
      customUtils.uid(8).length.should.equal(8);
      customUtils.uid(12).length.should.equal(12);
      customUtils.uid(15).length.should.equal(15);
    });

    it('Strings generated are random and unique (to a very high probability)', function () {
      customUtils.uid(8).should.not.equal(customUtils.uid(8));
    });

  });   // ==== End of '#uid' ==== //


  describe('#settingDefined', function () {

    it('A string setting is defined iif it is non null, undefined or of length 0', function() {
      customUtils.settingDefined(null).should.equal(false);
      customUtils.settingDefined(undefined).should.equal(false);
      customUtils.settingDefined('').should.equal(false);
      customUtils.settingDefined('set').should.equal(true);
    });

  });   // ==== End of '#settingDefined' ==== //


  describe('Password encryption', function () {

    it('Encrypts a password with its uniquely generated salt, preventing rainbow tables attacks', function (done) {
      var password = 'supersecret';

      // Generate two encrypted passwords from the same password
      customUtils.encryptPassword(password, function (err, e1) {
        assert.isNull(err);
        customUtils.encryptPassword(password, function (err, e2) {
          assert.isNull(err);

          // Salt length as defined in config
          e1.salt.length.should.equal(config.passwordEncryption.saltLength);
          e2.salt.length.should.equal(config.passwordEncryption.saltLength);

          // Derived keys length as in config
          e1.derivedKey.length.should.equal(config.passwordEncryption.encryptedLength);
          e2.derivedKey.length.should.equal(config.passwordEncryption.encryptedLength);

          // The two salts should be different, as well as the derived keys
          e1.salt.should.not.equal(e2.salt);
          e1.derivedKey.should.not.equal(e2.derivedKey);

          // Of course, the derived keys should not be equal to the original password
          e1.derivedKey.should.not.equal(password);
          e2.derivedKey.should.not.equal(password);

          done();
        });
      });
    });

    it('Can check whether a given password matches its encrypted version', function (done) {
      var password = 'supersecret';

      customUtils.encryptPassword(password, function (err, e1) {
        assert.isNull(err);

        customUtils.checkPassword('supersecre', e1, function (err, ok) {
          assert.isNull(err);
          ok.should.equal(false);

          customUtils.checkPassword('supersecrett', e1, function (err, ok) {
            assert.isNull(err);
            ok.should.equal(false);

            customUtils.checkPassword('supersecret', e1, function (err, ok) {
              assert.isNull(err);
              ok.should.equal(true);

              done();
            });
          });
        });
      });
    });

  });   // ==== End of 'Password encryption' ==== //

});
