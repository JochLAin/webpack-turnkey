#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
if (args[0] && args[0].indexOf('-') == -1) {
    process.env.WEBPACK_ENTRY = args.splice(0, 1);
}

const options = [
    `--config=${path.resolve(__dirname, 'config.js')}`,
    ...args,
];

if (process.env.NODE_ENV == 'prod') options.push(`-p`);
else options.push(`-d`);
spawn('webpack', options, { stdio: 'inherit' });
