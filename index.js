
(function () {
  
    const funkyLogger = require('./funkylogger');
    const fs = require('fs');
  
    'use strict';
  
    var SpecTally = function (baseReporterDecorator, config) {
  
      this.collection = {};
      let defaultConfig = {
        console: false,
        fileName: 'spec-tally-report',
        ext: 'json',
        outDir: 'report/spec-tally-report',
        writeLog: false,
        bail: false
      }
  
      let extendedConfig = Object.assign(defaultConfig, config.specTallyReporter);
  
      baseReporterDecorator(this);
  
      function recursiveMkDir(folderPath) {
        let folders = folderPath.split('/');
        let path = __dirname + '/../..';
        folders.forEach((folder) => {
          if (folder) {
            path = path + '/' + folder;
            if (!fs.existsSync(path)) {
              fs.mkdirSync(path);
            }
          }
        });
      }
  
      function buildErrorMessage(result) {
        this.suite = result.suite.join(' > ');
        this.description = result.description;
        this.assertionError = result.assertionError;
        this.log = result.log;
      }
  
      this.printResult = (id) => {
        const result = this.collection[id].lastResult;
        const errors = this.collection[id].errors;
  
        const tally = result.success + result.failed + result.skipped;
  
        if (tally !== result.total) {
          console.log(funkyLogger.color('red', 'Error!!!'));
          console.log(funkyLogger.color('red', 'All tests did not execute!!!'));
  
          if (result.disconnected) {
            console.log(funkyLogger.color('magenta', 'Probable cause for error: '),
              funkyLogger.color('cyan', 'Browser Disconnected'));
          } else if (result.failed) {
            console.log(funkyLogger.color('magenta', 'Probable cause for error: '),
              funkyLogger.color('cyan', 'Error in beforeEach()/afterEach() hook or Injector error'));
          } else {
            console.log(funkyLogger.color('magenta', 'Probable cause for error: '),
              funkyLogger.color('cyan', 'unknown'));
          }
  
          if (extendedConfig.console) {
            console.log(funkyLogger.color('red', '\n' + errors))
          }
  
        } else {
          console.log(funkyLogger.color('green', 'All tests were executed successfully!!'));
        }
  
        console.log(funkyLogger.color('white', '\nSpec count summary:'));
        console.log(funkyLogger.color('green', '\tSuccess: \t\t' + result.success + ' (' +
          ((result.success * 100) / result.total).toFixed(2) + '%)'));
        console.log(funkyLogger.color('yellow', '\tFailed: \t\t' + result.failed + ' (' +
          ((result.failed * 100) / result.total).toFixed(2) + '%)'));
        console.log(funkyLogger.color('cyan', '\tSkipped: \t\t' + result.skipped + ' (' +
          ((result.skipped * 100) / result.total).toFixed(2) + '%)'));
        console.log(funkyLogger.color('red', '\tDid not execute: \t' + (result.total - tally) + ' (' +
          (((result.total - tally) * 100) / result.total).toFixed(2) + '%)'));
        console.log(funkyLogger.color('magenta', '\tTotal: \t\t\t' + result.total + '\n'));

        console.log(funkyLogger.color('cyan', 'Total time taken including bundling: '),
          funkyLogger.color('magenta', (result.totalTime / 100).toFixed() + ' sec.'));
        console.log(funkyLogger.color('cyan', 'Time taken for actual test execution: '),
          funkyLogger.color('magenta', (result.netTime / 100).toFixed() + ' sec.'));
  
      }
  
      this.onRunComplete = (browsers) => {
        browsers.forEach((browser) => {

          const result = this.collection[browser.id].lastResult;
          this.printResult(browser.id);

          if (extendedConfig.writeLog) {
            recursiveMkDir(extendedConfig.outDir);
            fs.writeFileSync(__dirname + '/../../' + extendedConfig.outDir + '/' +
              extendedConfig.fileName + '.' + extendedConfig.ext,
              JSON.stringify(this.collection[browser.id].errors, null, 2), 'utf8');
            console.log(funkyLogger.color('yellow', 'Error log written to file successfully!\n'));
          }

          if (extendedConfig.bail && ((result.success + result.failed + result.skipped) !== result.total)) {
            console.log(funkyLogger.color('red', '\nExecuted tests didn\'t add up, bailing...\n'));
            process.exit(1);
          }

        });
      };
  
      this.onBrowserComplete = (browser) => {
        this.collection[browser.id].lastResult = browser.lastResult;
      };
  
      this.onSpecComplete = (browser, result) => {
        if (!result.success && !result.skipped) {
          this.collection[browser.id].errors.push(new buildErrorMessage(result));
        }
      }
  
      this.onBrowserStart = (browser) => {
        this.collection[browser.id] = {
          lastResult: {},
          errors: []
        };
      };
  
    };
  
    SpecTally.$inject = ['baseReporterDecorator', 'config'];
  
    module.exports = {
      'reporter:spec-tally': ['type', SpecTally]
    };
  
  }());  
  