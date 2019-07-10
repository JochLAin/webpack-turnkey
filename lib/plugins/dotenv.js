'use strict';

const { DefinePlugin } = require('webpack');
const dotenv = require('../utils/dotenv');

module.exports = class DotEnvPlugin {
    constructor (props) {
        this.props = props;
    }

    apply(compiler) {
        let env;
        if (!Array.isArray(this.props)) {
            env = typeof this.props === 'string'
                ? dotenv(this.props)
                : this.props
            ;
        } else {
            env = this.props.map(vars => {
                return typeof vars === 'string'
                    ? dotenv(vars)
                    : vars
                ;
            }).reduce((accu, item) => {
                return Object.assign({}, accu, item);
            }, {});
        }

        compiler.apply(new DefinePlugin({
            'process.env': Object.keys(env).reduce((definitions, key) => {
                const match = env[key].match(/\${([\s\S]+)}/);
                if (match) {
                    definitions[key] = JSON.stringify(env[match[1]]);
                } else {
                    definitions[key] = JSON.stringify(env[key]);
                }
                return definitions;
            }, {})
        }));
    }
};