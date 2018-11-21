'use strict';

const fs = require('fs');
const path = require('path');
const { OUTPUT_DIR, PAGE_DIR } = require('./lib/constants');
const CONFIG = require('./lib/constants/config');
const DotEnvPlugin = require('./lib/plugins/dotenv');
const browse = require('./lib/utils/file/browse');

let config = {
    plugins: [
        new DotEnvPlugin([
            path.resolve('.env'), 
            path.resolve('.entity.env')
        ]),
    ],
    module: { rules: CONFIG.rules },
    resolve: {
        extensions: CONFIG.extensions,
        alias: CONFIG.alias, 
    },
};
delete CONFIG.rules;
delete CONFIG.extensions;
delete CONFIG.alias;

Object.assign(config, CONFIG);

let entry = null;
if (process.env.WEBPACK_TURNKEY_ENTRY) {
    if (process.env.WEBPACK_TURNKEY_ENTRY.indexOf(',') > -1) {
        entry = process.env.WEBPACK_TURNKEY_ENTRY.split(',').map(filename => {
            return path.resolve(PAGE_DIR, filename)
        });
    } else {
        entry = path.resolve(PAGE_DIR, process.env.WEBPACK_TURNKEY_ENTRY);
    }
} else {
    entry = PAGE_DIR;
}

const _browse = (filename) => {
    if (!fs.lstatSync(filename).isDirectory()) {
        return [filename];
    } else {
        return browse(filename, -1, true, false);
    }
}

if (Array.isArray(entry)) {
    entry = entry.map(_browse).reduce((accu, item) => accu.concat(item), []);
} else {
    entry = _browse(entry);
}

const scripts = entry.map(page => Object.assign({}, config, {
    entry: page, 
    output: { 
        path: path.resolve(OUTPUT_DIR, path.relative(PAGE_DIR, path.parse(page).dir)), 
        filename: `${path.parse(page).name}.js` 
    },
}));

module.exports = scripts.length == 1 ? scripts[0] : scripts;
