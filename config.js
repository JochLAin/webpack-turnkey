'use strict';

const fs = require('fs');
const path = require('path');
const { OUTPUT_SUFFIX, PAGE_DIR, PUBLIC_DIR } = require('./lib/constants');
const CONFIG = require('./lib/constants/config');
const DotEnvPlugin = require('./lib/plugins/dotenv');
const browse = require('./lib/utils/file/browse');

const config = {
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

let entry = process.env.WEBPACK_ENTRY
    ? path.resolve(PAGE_DIR, process.env.WEBPACK_ENTRY)
    : browse(PAGE_DIR, -1, true, false)
;

if (!entry) module.exports = config;
else {
    if (!Array.isArray(entry)) {
        if (fs.lstatSync(entry).isDirectory()) entry = browse(entry, -1, true, false);
        else entry = [entry];
    }

    const scripts = entry.map(page => Object({
        ...config,
        entry: page, 
        output: { 
            path: path.resolve(PUBLIC_DIR, OUTPUT_SUFFIX, path.relative(PAGE_DIR, path.parse(page).dir)), 
            filename: `${path.parse(page).name}.js` 
        },
    }));

    module.exports = scripts.length == 1 ? scripts[0] : scripts;
}
