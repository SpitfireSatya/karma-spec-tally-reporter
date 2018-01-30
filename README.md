# karma-spec-tally-reporter

> Reporter for matching count of specs executed with total specs.

## Installation

The easiest way is to keep `karma-spec-tally-reporter` as a devDependency in your `package.json`. Just run

```bash
npm install karma-spec-tally-reporter --save-dev
```

to let npm automatically add it there.

## Usage

Simply add it to the reporters array of you karma config like

```js
reporters: ['spec-tally']
```

and you're done!!

## Config

The karma-spec-tally-reports takes the following config object in karma.conf and the default values are as below

```js
specTallyReporter: {
  "console": false, // show error logs on console
  "fileName": "spec-tally-report",
  "ext": "json",
  "outDir": "report/spec-tally-report",
  "writeLog": false, // write logs to given fileName
  "bail": false // invokes process.exit if spec tally mismatch
}
```

## Sample Report

![This is what the report looks like](sample.jpg?raw=true "Sample Report")
