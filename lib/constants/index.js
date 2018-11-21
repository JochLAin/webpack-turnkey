'use strict';

const path = require('path');

/////////////////////////* DIRECTORIES */////////////////////////
const PROJECT_DIR   = process.env.PROJECT_DIR   = module.exports.PROJECT_DIR   = process.env.PROJECT_DIR   || path.resolve();
const ASSET_SUFFIX  = process.env.ASSET_SUFFIX  = module.exports.ASSET_SUFFIX  = process.env.ASSET_SUFFIX  || 'assets';
const ASSET_DIR     = process.env.ASSET_DIR     = module.exports.ASSET_DIR     = process.env.ASSET_DIR     || path.resolve(PROJECT_DIR, ASSET_SUFFIX);
const PAGE_SUFFIX   = process.env.PAGE_SUFFIX   = module.exports.PAGE_SUFFIX   = process.env.PAGE_SUFFIX   || 'pages';
const PAGE_DIR      = process.env.PAGE_DIR      = module.exports.PAGE_DIR      = process.env.PAGE_DIR      || path.resolve(ASSET_DIR, PAGE_SUFFIX);
const PUBLIC_SUFFIX = process.env.PUBLIC_SUFFIX = module.exports.PUBLIC_SUFFIX = process.env.PUBLIC_SUFFIX || 'public';
const PUBLIC_DIR    = process.env.PUBLIC_DIR    = module.exports.PUBLIC_DIR    = process.env.PUBLIC_DIR    || path.resolve(PROJECT_DIR, PUBLIC_SUFFIX);
const OUTPUT_SUFFIX = process.env.OUTPUT_SUFFIX = module.exports.OUTPUT_SUFFIX = process.env.OUTPUT_SUFFIX || 'js';
const OUTPUT_DIR    = process.env.OUTPUT_DIR    = module.exports.OUTPUT_DIR    = process.env.OUTPUT_DIR    || path.resolve(PUBLIC_DIR, OUTPUT_SUFFIX);