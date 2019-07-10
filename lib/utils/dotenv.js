'use strict';

const dotenv = require('dotenv');
const { exists, read } = require('./file');

module.exports = (path) => {
    path = require('path').resolve(path);
    if (!exists(path)) {
        return {};
    }
    const env = dotenv.parse(read(path));
    return Object.keys(env).reduce((definitions, key) => {
        const match = env[key].match(/\${([\s\S]+)}/);
        if (match && env[match[1]]) {
            definitions[key] = env[match[1]];
        } else {
            definitions[key] = env[key];
        }
        return definitions;
    }, {});
};