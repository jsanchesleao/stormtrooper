var R = require('ramda');
var S = require('spots');
var Validation = require('data.validation');

var curry = R.curry;
var ifElse = R.ifElse;
var K = R.always;
var T = R.T;
var cond = R.cond;
var compose = R.compose;

var failureMap = fn => validation => validation.failureMap(fn);

var safeRun = (fn) => (...args) => {
    try {
      return fn(...args);
    }
    catch(e) {
      return undefined;
    }
  };

var execRule = curry((rule, value) =>
  ifElse( 
    safeRun(rule.test),
    Validation.Success,
    K(Validation.Failure([{rule: rule.name}]))
  )(value));

//+ mergeValidations :: [Validation] => Validation
var mergeValidations = R.foldl((acc, validation) =>
  cond(
    [K(acc.isSuccess),        K(validation)],
    [K(validation.isSuccess), K(acc)],
    [T,                       failureMap(
                                R.concat(acc.merge()))]
  )(validation),
  Validation.of(null));

//+ execRules :: [Rule], Any => Validation[Error, Any]
var execRules = curry((rules, value) =>
  compose(
    mergeValidations,
    R.map(S(execRule, S, value))
  )(rules));

module.exports = {
  execRule,
  execRules
};
