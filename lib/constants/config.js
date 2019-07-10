"use strict";

const path = require('path');
const { exists } = require('../utils/file');
const { WEBPACK_TURNKEY_ASSET_DIR } = require('./index');
const DotEnvPlugin = require('../plugins/dotenv');

const aliases = [
    'components', 'constants',
    'middlewares', 'managers', 'models', 'utils',
    'actions', 'capsules', 'connecters', 'containers', 'pages', 'reducers',
    'fonts', 'images', 'sounds', 'stylesheets', 'videos'
];

let config = {
    plugins: [
        new DotEnvPlugin([
            process.env,
            path.resolve('.env'),
            path.resolve(`.env.${process.env.NODE_ENV}`),
            path.resolve('.entity.env'),
        ]),
    ],
    rules: [
        { test: /\.html$/, use: { loader: 'file-loader?name=[name].[ext]'} },
        { test: /\.m?jsx?$/, use: [
            { loader: 'babel-loader', options: { babelrc: true, cacheDirectory: true, extends: !exists('.babelrc') ? path.resolve(__dirname, '.babelrc') : undefined }}
        ]},
        { test: /\.(sa|sc|c)ss$/, use: [
            { loader: 'style-loader', options: { sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'css-loader', options: { sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP }},
            { loader: 'sass-loader', options: { sourceMap: !!process.env.WEBPACK_TURNKEY_SOURCEMAP, includePaths: [path.resolve('node_modules') + '/']}},
        ]},
        { test: /\.svg(\?(v=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=image/svg+xml&name=fonts/[name].[ext]' }},
        { test: /\.woff(\?(v=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=application/font-woff&name=fonts/[name].[ext]' }},
        { test: /\.woff2(\?(v=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=application/font-woff2&name=fonts/[name].[ext]' }},
        { test: /\.[ot]tf(\?(v=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=application/octet-stream&name=fonts/[name].[ext]' }},
        { test: /\.eot(\?(v=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]' }},
        { test: /\.jpe?g(\?(v=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=image/jpeg&name=images/[name].[ext]' }},
        { test: /\.png(\?(v=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=image/png&name=images/[name].[ext]' }},
        { test: /\.gif(\?(v=?)?(\d(\.\d+)*)?)?$/, use: { loader: 'url-loader?mimetype=image/gif&name=images/[name].[ext]' }},
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
                formatter: require('eslint').CLIEngine.getFormatter('stylish'),
            }
        }]
    });
}

if (exists(path.resolve('webpack-turnkey.config.js'))) {
    const _config = require(path.resolve('webpack-turnkey.config.js'));
    module.exports = Object.assign({}, config, _config, {
        alias: Object.assign({}, config.alias, _config.alias || {}),
        extensions: [].concat(config.extensions, _config.extensions || []),
        plugins: [].concat(config.plugins, _config.plugins || []),
        optimization: Object.assign({}, config.optimization, _config.optimization || {}),
        rules: [].concat(config.rules, _config.rules || [])
    });
} else {
    module.exports = config;
}