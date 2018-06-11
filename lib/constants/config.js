'use strict';

const path = require('path');
const { copy, exists } = require('../utils/file');
const { ASSET_DIR } = require('./index');

const aliases = [
    'actions', 'capsules', 'components', 'connecters',
    'constants', 'containers', 'fonts',
    'images', 'middlewares', 'pages', 'reducers',
    'sounds', 'stylesheets', 'utils', 'videos'
];

let config = {
    rules: [
        { test: /\.html$/, use: { loader: 'file-loader?name=[name].[ext]'} },
        { test: /\.js$/, use: { loader: 'babel-loader', options: {
            presets: ['env', 'es2015', 'stage-0', 'stage-1', 'stage-2', 'stage-3', 'react']
        }}},
        { test: /\.jsx$/, use: { loader: 'babel-loader', options: {
            presets: ['env', 'es2015', 'stage-0', 'stage-1', 'stage-2', 'stage-3', 'react']
        }}},
        { test: /\.css$/, use: [{ loader: 'style-loader'}, { loader: 'css-loader', options: { sourceMap: true }}] },
        { test: /\.s[ac]ss$/, use: [
            { loader: 'style-loader'},
            { loader: 'css-loader', options: { sourceMap: true }},
            { loader: 'sass-loader', options: { sourceMap: true, includePaths: [path.resolve('node_modules') + '/']}}
        ]},
        { test: /\.svg(\?(v\=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=image/svg+xml&name=fonts/[name].[ext]' }},
        { test: /\.woff(\?(v\=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=application/font-woff&name=fonts/[name].[ext]' }},
        { test: /\.woff2(\?(v\=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=application/font-woff2&name=fonts/[name].[ext]' }},
        { test: /\.[ot]tf(\?(v\=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=application/octet-stream&name=fonts/[name].[ext]' }},
        { test: /\.eot(\?(v\=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]' }},
        { test: /\.jpe?g(\?(v\=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=image/jpeg&name=images/[name].[ext]' }},
        { test: /\.png(\?(v\=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=image/png&name=images/[name].[ext]' }},
        { test: /\.gif(\?(v\=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=image/gif&name=images/[name].[ext]' }},
    ],
    extensions: [
        '.html',
        '.js', '.jsx', '.json',
        '.css', '.sass', '.scss',
        '.png', '.jpg', '.jpeg', '.gif', '.svg',
        '.woff', '.woff2', '.otf', '.ttf', '.eot'
    ],
    alias: aliases.reduce((accu, alias) => Object.assign({}, accu, {
        [`@${alias}`]: path.resolve(ASSET_DIR, alias)
    }), {}),
};

if (process.env.WEBPACK_TURNKEY_ESLINT) {
    config.rules.push({
        enforce: "pre",
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: [{ 
            loader: 'eslint-loader',
            options: {
                fix: true,
            }
        }]
    });

    if (!exists('.eslintrc.js')
    && !exists('.eslintrc.json')
    && !exists('.eslintrc.yml')
    && !exists('.eslintrc.yaml')) {
        copy(
            path.resolve(__dirname, '.eslintrc.js'), 
            path.resolve('.eslintrc.js')
        );
    }
}

if (exists(path.resolve('webpack-turnkey.config.js'))) {
    const _config = require(path.resolve('webpack-turnkey.config.js'));
    module.exports = Object.assign({}, config, _config, {
        rules: [].concat(config.rules, _config.rules || []),
        extensions: [].concat(config.extensions, _config.extensions || []),
        alias: Object.assign({}, config.alias, _config.alias || {})
    });
} else {
    module.exports = config;
}