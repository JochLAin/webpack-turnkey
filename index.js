#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

let options = [`--config=${path.resolve(__dirname, 'config.js')}`];
if (process.env.NODE_ENV == 'prod') options.push(`-p`);
else options.push(`-d`, `--watch`);
spawn('webpack', options, { stdio: 'inherit' });
