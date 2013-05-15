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

});
