"use strict";
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

  it('can apply a group of validation rules against a single value, aggregating the failures', function() {
    var odd = {
      name: 'odd',
      test: function(x) {
        return (x % 2) === 1;
      }
    };

    var positive = {
      name: 'positive',
      test: gt(_, 0)
    };

    var resultOK = st.execRules([odd, positive], 1);
    var resultNOK = st.execRules([odd, positive], 2);
    var resultDoubleNOK = st.execRules([odd, positive], -2);

    expect(resultOK.merge()).to.equal(1);
    expect(resultNOK.merge()).to.deep.equal([{rule: 'odd'}]);
    expect(resultDoubleNOK.merge()).to.deep.equal([{rule: 'odd'},{rule: 'positive'}]);

  });

});
