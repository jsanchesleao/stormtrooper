var chai = require('chai');
var expect = chai.expect;
var st = require('../src');

var R = require('ramda');
var _ = R.__;
var gt = R.gt;

describe('Stormtrooper Validator', function() {

  it('can apply a validation rule against a value', function() {

    var validationRule = {
      name: 'positive',
      test: gt(_, 0)
    };

    var resultOK = st.execRule(validationRule, 10);
    var resultNOK = st.execRule(validationRule, -10);

    expect(resultOK.merge()).to.equal(10);
    expect(resultNOK.merge()).to.deep.equal([{rule: 'positive'}]);

  });

});
