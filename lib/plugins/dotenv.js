'use strict';

const { DefinePlugin } = require('webpack');
const dotenv = require('../utils/dotenv');

module.exports = class DotEnvPlugin {
    constructor (props) {
        this.props = Object.freeze(Object.assign({}, props));
    }

    apply(compiler) {
        if (!Array.isArray(this.props)) {
            compiler.apply(new DefinePlugin({
                'process.env': typeof this.props === 'string'
                    ? dotenv(this.props, true)
                    : this.props
            }));
        }
        compiler.apply(new DefinePlugin({
            'process.env': this.props.map(vars => {
                return typeof vars === 'string'
                    ? dotenv(vars, true)
                    : vars
                ;
            }).reduce((accu, item) => {
                return Object.assign({}, accu, item);
            }, {})
        }));
    }
};