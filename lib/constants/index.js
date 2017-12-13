'use strict';

const path = require('path');

/////////////////////////* DIRECTORIES */////////////////////////
const PROJECT_DIR   = module.exports.PROJECT_DIR    = process.env.PROJECT_DIR   || path.resolve();
const ASSET_DIR     = module.exports.ASSET_DIR      = process.env.ASSET_DIR     || path.resolve(PROJECT_DIR, 'assets');
const PAGE_DIR      = module.exports.PAGE_DIR       = process.env.PAGE_DIR      || path.resolve(ASSET_DIR,   'pages');
const PUBLIC_DIR    = module.exports.PUBLIC_DIR     = process.env.PUBLIC_DIR    || path.resolve(PROJECT_DIR, 'public');
const OUTPUT_DIR    = module.exports.OUTPUT_DIR     = process.env.OUTPUT_DIR    || 'js';