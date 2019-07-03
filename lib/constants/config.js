"use strict";

const path = require('path');
const { exists } = require('../utils/file');
const { WEBPACK_TURNKEY_ASSET_DIR } = require('./index');

const aliases = [
    'components', 'constants',
    'middlewares', 'managers', 'models', 'utils',
    'actions', 'capsules', 'connecters', 'containers', 'pages', 'reducers',
    'fonts', 'images', 'sounds', 'stylesheets', 'videos'
];

let config = {
    plugins: [],
    rules: [
        { test: /\.html$/, use: { loader: 'file-loader?name=[name].[ext]'} },
        { test: /\.m?jsx?$/, use: { loader: 'babel-loader', options: {
            presets: ['env', 'stage-0', 'stage-1', 'stage-2', 'stage-3', 'react']
        }}},
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
        '.mjs', '.js', '.jsx', '.json',
        '.css', '.sass', '.scss',
        '.png', '.jpg', '.jpeg', '.gif', '.svg',
        '.woff', '.woff2', '.otf', '.ttf', '.eot'
    ],
    alias: aliases.reduce((accu, alias) => Object.assign({}, accu, {
        [`@${alias}`]: path.resolve(WEBPACK_TURNKEY_ASSET_DIR, alias)
    }), {}),
};

if (process.env.NODE_ENV !== "production") {
    config.rules.push(
        { test: /\.css$/, use: [
            { loader: 'style-loader', options: { sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'postcss-loader', options: { exec: true }},
        ]},
        { test: /\.s[ac]ss$/, use: [
            { loader: 'style-loader', options: { sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'postcss-loader', options: { exec: true, sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'sass-loader', options: { sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP, includePaths: [path.resolve('node_modules') + '/']}}
        ]}
    );
} else {
    const hasNoConfig = !exists('postcss.config.js');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        })
    );
    config.rules.push({
        test: /\.(sa|sc|c)ss$/,
            use: [
            { loader: MiniCssExtractPlugin.loader, options: { config: {  }}},
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'postcss-loader', options: { exec: true, sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'sass-loader', options: { sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP, includePaths: [path.resolve('node_modules') + '/']}},
        ],
    });
}

if (process.env.WEBPACK_TURNKEY_ESLINT) {
    const hasNoConfig = !exists('.eslintrc.js') && !exists('.eslintrc.json') && !exists('.eslintrc.yml') && !exists('.eslintrc.yaml');
    config.rules.push({
        enforce: "pre",
        test: /\.m?jsx?$/, 
        exclude: /node_modules/,
        use: [{ 
            loader: 'eslint-loader',
            options: {
                configFile: hasNoConfig && path.resolve(__dirname, '.eslintrc.js'),
                fix: true,
            }
        }]
    });
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