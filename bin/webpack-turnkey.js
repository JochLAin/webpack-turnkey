#!/usr/bin/env node

const { spawn } = require('child_process');

const program = require('commander');
const path = require('path');
const package = require(path.resolve(__dirname, '../package.json'));

program
    .usage('[options] <file...>')
    .version(package.version, '-v, --version')
    .option('--eslint', 'Enable ESLint')
    .option('--sourcemap', 'Enable SourceMap')
    .option('--bundled', 'Set project directory to current working directory')
    .option('--volatile', 'Set input and output directory to current working directory')
    .allowUnknownOption()
    .parse(process.argv)
;

if (program.args.length) {
    process.env.WEBPACK_TURNKEY_ENTRY = program.args;
}
if (program.eslint) {
    process.env.WEBPACK_TURNKEY_ESLINT = true;
}
if (program.sourcemap) {
    process.env.WEBPACK_TURNKEY_SOURCEMAP = true;
}
if (program.bundled) {
    process.env.WEBPACK_TURNKEY_PROJECT_DIR = process.cwd();
}
if (program.volatile) {
    if (program.args.length) {
        process.env.WEBPACK_TURNKEY_OUTPUT_DIR = process.cwd();
        process.env.WEBPACK_TURNKEY_PAGE_DIR = process.cwd();
    }
}

// Parse command options
const options = require('../lib/options').get();
if (process.env.NODE_ENV == 'prod') options.push(`-p`);
else options.push(`-d`);

spawn('npx', ['webpack'].concat(options), {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
});