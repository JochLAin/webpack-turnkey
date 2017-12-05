'use strict';

const fs = require('fs');
const path = require('path');

const browse = module.exports = (filename, depth = -1, check_file = true, check_folder = true, without_source_folder) => {
    if (!fs.existsSync(filename)) return [];
    let stat = fs.lstatSync(filename);
    if (stat.isFile()) {
        if (check_file instanceof Function) return check_file(filename) ? [filename] : [];
        return check_file ? [filename] : [];
    } else if (stat.isDirectory()) {
        const folding = check_folder instanceof Function ? check_folder(filename) : check_folder;
        const files = !without_source_folder && folding ? [filename] : [];
        const deeper = depth instanceof Function ? depth(filename) : depth;
        if (!deeper) return files;
        return files.concat(browse_map(
            fs.readdirSync(filename).map(child => path.resolve(filename, child)),
            depth instanceof Function ? depth : depth - 1, 
            check_file, 
            check_folder
        ));
    }
};

const browse_expand = module.exports.expand = filenames => {
    const expand = (tree, ...parts) => {
        if (!parts.length) return tree;
        const name = parts.shift();
        tree[name] = Object.assign({}, tree[name]);
        expand(tree[name], ...parts);
        return tree;
    }
    const tree = {};
    for (let index in filenames) 
        expand(tree, ...filenames[index].split('/'));
    return tree;
};

const browse_find = module.exports.find = (filenames, key) => {
    if (!(key instanceof RegExp)) key = new RegExp(`^(${key})`)
    return filenames.filter(filename => key.test(filename))
        .map(filename => filename.slice(filename.match(key)[1].length +1));
};

const browse_flatten = module.exports.flatten = (tree, prefix = '/') => {
    const flatten = (filenames, tree, prefix) => {
        for (let key in tree) {
            let name = path.resolve(prefix, key);
            filenames.push(name);
            flatten(filenames, tree[key], name);
        }
        return filenames;
    };
    return flatten([], tree, prefix);
};

const browse_map = module.exports.map = (filenames, depth = -1, check_file = true, check_folder = false) => {
    return filenames.map(filename => browse(filename, depth, check_file, check_folder))
        .reduce((list, item) => item ? list.concat(...item) : list, [])
};

const browse_search = module.exports.search = (filenames, regex) => {
    const recursive = (bundles, prefix = '/') => {
        let _bundles = [];
        for (let file in bundles) {
            let filename = path.resolve(prefix, file);
            if (regex.test(filename)) _bundles.push({ name: filename.slice(1), props: bundles[file] });
            else _bundles = _bundles.concat(recursive(bundles[file], filename));
        }
        return _bundles;
    }
    if (filenames instanceof Array) return recursive(browse_expand(filenames));
    return recursive(filenames);
};
