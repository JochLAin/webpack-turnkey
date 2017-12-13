'use strict';

const dotenv = require('dotenv');
const { read } = require('./file');

module.exports = (path, stringify = false) => {
    const env = dotenv.parse(read(require('path').resolve(path)));
    return Object.keys(env).reduce((definitions, key) => {
        const match = env[key].match(/\$\{([\s\S]+)\}/);
        if (match) definitions[key] = stringify ? JSON.stringify(env[match[1]]) : env[match[1]];
        else definitions[key] = stringify ? JSON.stringify(env[key]) : env[key];
        return definitions;
    }, {});
}