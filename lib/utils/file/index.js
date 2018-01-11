'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const exists = module.exports.exists = filename => {
    if (!fs.existsSync(filename)) return false;

    const stat = fs.lstatSync(filename);
    return stat.isFile() || stat.isDirectory() || stat.isSymbolicLink();
};
const mkdir = module.exports.mkdir = filename => {
    return child_process.execSync(`mkdir -p ${path.dirname(path.resolve(filename))}`);
};
const touch = module.exports.touch = filename => {
    mkdir(filename);
    return child_process.execSync(`touch ${filename}`);
};

const read = module.exports.read = filename => {
    if (!fs.lstatSync(filename).isFile()) return '';
    return fs.readFileSync(filename).toString();
};

const remove = module.exports.remove = filename => {
    if (!fs.lstatSync(filename).isFile()) return;
    return child_process.execSync(`rm -rf ${path.resolve(filename)}`);
};

const write = module.exports.write = (filename, content) => {
    filename = path.resolve(filename);
    touch(filename);
    if (typeof content == 'object') content = JSON.stringify(content, null, 4);
    return fs.writeFileSync(filename, content, filename.match(/(\.jpg|\.jpeg|\.png|\.bmp)$/) ? 'binary' : undefined);
};