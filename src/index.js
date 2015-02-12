var _ = require('ramda');
var S = require('spots');
var Validation = require('data.validation');


var safeRun = function(fn) {
  return function() {
    try {
      return fn.apply(null, arguments);
    }
    catch(e) {
      return undefined;
    }
  };
}

var execRule = _.curry(function(rule, value) {
  return _.ifElse( 
      safeRun(rule.test),
        Validation.Success,
        _.always(Validation.Failure([{rule: rule.name}]))
      )(value);
});

module.exports = {
  execRule: execRule
};
