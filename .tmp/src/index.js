"use strict";
var _slice = Array.prototype.slice;
var R = require('ramda');
var S = require('spots');
var Validation = require('data.validation');

var curry = R.curry;
var ifElse = R.ifElse;
var K = R.always;
var T = R.T;
var cond = R.cond;
var compose = R.compose;

var failureMap = function(fn) {
  return function(validation) {
    return validation.failureMap(fn);
  };
};

var safeRun = function(fn) {
  return function() {
    var args = _slice.call(arguments);
    try {
      return fn.apply(null, _slice.call(args));
    }
    catch(e) {
      return undefined;
    }
  };
};

var execRule = curry(function(rule, value) {
  return ifElse( 
    safeRun(rule.test),
    Validation.Success,
    K(Validation.Failure([{rule: rule.name}]))
  )(value);
});

//+ mergeValidations :: [Validation] => Validation
var mergeValidations = R.foldl(function(acc, validation) {
  return cond(
    [K(acc.isSuccess),        K(validation)],
    [K(validation.isSuccess), K(acc)],
    [T,                       failureMap(
                                R.concat(acc.merge()))]
  )(validation);
},
  Validation.of(null));

//+ execRules :: [Rule], Any => Validation[Error, Any]
var execRules = curry(function(rules, value) {
  return compose(
    mergeValidations,
    R.map(S(execRule, S, value))
  )(rules);
});

module.exports = {
  execRule: execRule,
  execRules: execRules
};
