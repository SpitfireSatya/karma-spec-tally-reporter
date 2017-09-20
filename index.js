(function () {

  const funkyLogger = require('./funkylogger');

  'use strict';

  var SpecTally = function (baseReporterDecorator, formatError) {
    baseReporterDecorator(this);

    this.onRunComplete = function (browsers, results) {
      console.log(funkyLogger.color('green', 'Spec tally reporter works with funky logger!!!'))
    };

    this.onSpecComplete = function (browser, result) {
    }

  };

  SpecTally.$inject = ['baseReporterDecorator', 'formatError'];

  module.exports = {
    'reporter:spec-tally': ['type', SpecTally]
  };

}());  
