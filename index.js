#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const argv = require('yargs').argv;

if (argv._.length) process.env.WEBPACK_TURNKEY_ENTRY = argv._;
if (argv.eslint) {
    process.env.WEBPACK_TURNKEY_ESLINT = true;
}
if (argv.sourmap) {
    process.env.WEBPACK_TURNKEY_SOURCEMAP = true;
}
const options = require('./lib/options')(argv);
if (process.env.NODE_ENV == 'prod') options.push(`-p`);
else options.push(`-d`);

spawn(path.resolve('node_modules/.bin/webpack'), options, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
});