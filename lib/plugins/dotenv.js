'use strict';

const { DefinePlugin } = require('webpack');
const dotenv = require('../utils/dotenv');
const { read } = require('../utils/file');

module.exports = class DotEnvPlugin {
    constructor (props) {
        if (typeof props == 'string' || Array.isArray(props)) props = { path: props };
        this.props = Object.freeze(Object.assign({}, props));
    }
    apply(compiler) {
        const env = Array.isArray(this.props.path)
            ? Object.assign({}, this.props.path.map(path => dotenv(path, true)).reduce((accu, item) => Object.assign({}, accu, item), {}))
            : Object.assign({}, dotenv(this.props.path, true));
        compiler.apply(new DefinePlugin({ 'process.env': env }));
    }
}