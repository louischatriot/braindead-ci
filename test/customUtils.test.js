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
        if (err) { return done(err.toString()); }
        customUtils.encryptPassword(password, function (err, e2) {
          if (err) { return done(err.toString()); }

          // Salt length as defined in config
          e1.salt.length.should.equal(config.passwordEncryption.saltLength);
          e2.salt.length.should.equal(config.passwordEncryption.saltLength);

          // Derived keys length as in config
          e1.derivedKey.length.should.equal(config.passwordEncryption.encryptedLength);
          e2.derivedKey.length.should.equal(config.passwordEncryption.encryptedLength);

          // Iterations are saved
          e1.iterations.should.equal(config.passwordEncryption.iterations);
          e2.iterations.should.equal(config.passwordEncryption.iterations);

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
        if (err) { return done(err.toString()); }

        customUtils.checkPassword('supersecre', e1, function (err, ok) {
          if (err) { return done(err.toString()); }
          ok.should.equal(false);

          customUtils.checkPassword('supersecrett', e1, function (err, ok) {
            if (err) { return done(err.toString()); }
            ok.should.equal(false);

            customUtils.checkPassword('supersecret', e1, function (err, ok) {
              if (err) { return done(err.toString()); }
              ok.should.equal(true);

              done();
            });
          });
        });
      });
    });

    it('Can change the password encryption settings and still check passwords encrypted with former method', function (done) {
      var password = 'supersecret';

      customUtils.encryptPassword(password, function (err, e1) {
        e1.salt.length.should.equal(config.passwordEncryption.saltLength);
        e1.derivedKey.length.should.equal(config.passwordEncryption.encryptedLength);
        e1.iterations.should.equal(config.passwordEncryption.iterations);

        // Change settings (increase strength)
        config.passwordEncryption.saltLength = 19;
        config.passwordEncryption.encryptedLength = 34;
        config.passwordEncryption.iterations = 20000;

        // New settings are immediately applied
        customUtils.encryptPassword(password, function (err, e2) {
          e2.salt.length.should.equal(19);
          e2.derivedKey.length.should.equal(34);
          e2.iterations.should.equal(20000);

          // We can still check against the password encrypted with the former method as well as the new method
          customUtils.checkPassword(password, e1, function (err, ok) {
            if (err) { return done(err.toString()); }
            ok.should.equal(true);

            customUtils.checkPassword(password, e2, function (err, ok) {
              if (err) { return done(err.toString()); }
              ok.should.equal(true);

              done();
            });
          });
        });
      });
    });

  });   // ==== End of 'Password encryption' ==== //

});
