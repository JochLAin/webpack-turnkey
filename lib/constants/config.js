'use strict';

const path = require('path');
const { ASSET_DIR } = require('./index');

const aliases = [
    'actions', 'capsules', 'components', 'connecters', 
    'constants', 'containers', 'fonts',
    'images', 'middlewares', 'pages', 'reducers', 
    'sounds', 'stylesheets', 'utils', 'videos'
];

let config = module.exports = {
    rules: [
        { test: /\.html$/, use: { loader: 'file-loader?name=[name].[ext]'} },
        { test: /\.js$/, use: { loader: 'babel-loader', options: { presets: ['env', 'es2015', 'stage-0', 'react'] }}},
        { test: /\.jsx$/, use: { loader: 'babel-loader', options: { presets: ['env', 'es2015', 'stage-0', 'react'] }}},
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
    alias: aliases.reduce((accu, alias) => {
        accu[`@${alias}`] = path.resolve(ASSET_DIR, alias);
        return accu;
    }, {}),
};
