'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const copy = module.exports.copy = (source, target) => {
    if (!exists(source)) throw new Error(`Source ${source} doesn't exists`);
    if (!exists(target)) mkdir(target);
    return child_process.execSync(`cp -R ${source} ${target}`);
}

const exists = module.exports.exists = filename => {
    filename = path.resolve(filename);
    if (!fs.existsSync(filename)) return false;

    const stat = fs.lstatSync(filename);
    return stat.isFile() || stat.isDirectory() || stat.isSymbolicLink();
};

const mkdir = module.exports.mkdir = filename => {
    filename = path.resolve(filename);
    return child_process.execSync(`mkdir -p ${path.dirname(filename)}`);
};

const touch = module.exports.touch = filename => {
    filename = path.resolve(filename);
    if (exists(filename)) return;
    mkdir(filename);
    return child_process.execSync(`touch ${filename}`);
};

const read = module.exports.read = filename => {
    filename = path.resolve(filename);
    if (exists(filename) && !fs.lstatSync(filename).isFile()) return '';
    return fs.readFileSync(filename).toString();
};

const remove = module.exports.remove = filename => {
    filename = path.resolve(filename);
    if (!exists(filename)) return;
    return child_process.execSync(`rm -rf ${filename}`);
};

const write = module.exports.write = (filename, content) => {
    filename = path.resolve(filename);
    touch(filename);
    if (typeof content == 'object') content = JSON.stringify(content, null, 4);
    return fs.writeFileSync(filename, content, filename.match(/(\.jpg|\.jpeg|\.png|\.bmp)$/) ? 'binary' : undefined);
};