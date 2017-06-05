'use strict';

const fs = require('fs');
const path = require('path');
const ALIASES = [
    'actions', 'components', 'connecters', 'constants', 'containers',
    'images', 'middlewares', 'pages', 'reducers', 'stylesheets', 'utils'
];
const REGEX_SRC = /src\/([\w\/]+)Bundle/;

const aliasify = module.exports = (bundles) => {
    let aliases = {};
    bundles.forEach(bundle => {
        if (REGEX_SRC.test(bundle)) {
            const matches = bundle.match(REGEX_SRC);
            const prefix = matches[1].replace(/\//g, '_').toLowerCase();
            ALIASES.forEach(alias => {
                const filename = path.resolve(bundle, alias);
                if (fs.existsSync(filename)) aliases[`@${prefix}.${alias}`] = filename;
            });
        } else {
            ALIASES.forEach(alias => {
                const filename = path.resolve(bundle, alias);
                if (fs.existsSync(filename)) aliases[`@${alias}`] = filename;
            });
        }
    });
    return aliases;
};
const assign = (filepath) => {
    const index = filepath.lastIndexOf('/');
    const filename = filepath.slice(index + 1);
    const page_dir = filepath.slice(filepath.indexOf('pages') + 6, index);
    let web_dir = 'web/js';
    if (REGEX_SRC.test(filepath)) web_dir = `web/bundles/${filepath.match(REGEX_SRC)[1].replace(/\//g, '_').toLowerCase()}/js`;
    const build_dir = path.resolve(__dirname, web_dir, page_dir);
    return {
        entry: filepath,
        output: {
            filename: `${filename.split('.')[0]}.js`,
            path: build_dir
        },
    };
}
const browse = (filename, folders = false) => {
    if (!fs.existsSync(filename)) return [];
    let stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
        let pathes = folders ? [filename] : [];
        fs.readdirSync(filename)
            .map(file => browse(path.resolve(filename, file), folders))
            .forEach(file => { pathes.push(...file); });
        return pathes;
    } else if (stat.isFile()) return [filename];
    return [];
};
const entrify = (bundles) => {
    const { WEBPACK_ENTRY } = process.env;
    const is_absolute = WEBPACK_ENTRY ? /^\//.test(WEBPACK_ENTRY) : false;
    const is_bundle = WEBPACK_ENTRY ? /^@[\w|\/]+Bundle/.test(WEBPACK_ENTRY) : false;
    let entries = bundles.map(bundle => `${bundle}/pages`);
    if (WEBPACK_ENTRY && is_absolute) entries = [WEBPACK_ENTRY];
    else if (WEBPACK_ENTRY && is_bundle) {
        if (/Bundle\/?$/.test(WEBPACK_ENTRY)) entries = [path.resolve(__dirname, 'src', WEBPACK_ENTRY.slice(1), 'Resources/pages')];
        else entries = [path.resolve(__dirname, 'src',
            WEBPACK_ENTRY.slice(1, WEBPACK_ENTRY.indexOf('Bundle/') + 'Bundle'.length),
            'Resources/pages',
            WEBPACK_ENTRY.slice(WEBPACK_ENTRY.indexOf('Bundle/') + 'Bundle/'.length)
        )];
    } else if (WEBPACK_ENTRY) entries = [path.resolve(__dirname, 'app/Resources/pages', WEBPACK_ENTRY)];

    console.log('Webpack entry', WEBPACK_ENTRY, /Bundle\/?$/.test(WEBPACK_ENTRY), entries);

    let config = [];
    entries.map(entry => browse(entry))
        .forEach(files => config.push(...files));
    return config;
};
const search = (name = '', folder = '') => {
    const files = browse(path.resolve(__dirname, folder), true);
    const REGEX_SRC = new RegExp(name);
    return files.filter(filename => REGEX_SRC.test(filename));
};

const config = {
    module: {
        rules: [
            { test: /\.html$/, loader: 'file-loader?name=[name].[ext]' },
            { test: /\.js$/, loader: 'babel-loader' },
            { test: /\.jsx$/, loader: 'babel-loader' },
            { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
            { test: /\.less$/, loaders: ['style-loader', 'css-loader', 'less-loader'] },

            { test: /\.svg(\?(v\=?)?(\d(\.\d+)*)?)?$/, loader: 'url-loader?mimetype=image/svg+xml&name=fonts/[name].[ext]' },
            { test: /\.woff(\?(v\=?)?(\d(\.\d+)*)?)?$/, loader: 'url-loader?mimetype=application/font-woff&name=fonts/[name].[ext]' },
            { test: /\.woff2(\?(v\=?)?(\d(\.\d+)*)?)?$/, loader: 'url-loader?mimetype=application/font-woff2&name=fonts/[name].[ext]' },
            { test: /\.[ot]tf(\?(v\=?)?(\d(\.\d+)*)?)?$/, loader: 'url-loader?mimetype=application/octet-stream&name=fonts/[name].[ext]' },
            { test: /\.eot(\?(v\=?)?(\d(\.\d+)*)?)?$/, loader: 'url-loader?mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]' },
            { test: /\.jpe?g(\?(v\=?)?(\d(\.\d+)*)?)?$/, loader: 'url-loader?mimetype=image/jpeg&name=images/[name].[ext]' },
            { test: /\.png(\?(v\=?)?(\d(\.\d+)*)?)?$/, loader: 'url-loader?mimetype=image/png&name=images/[name].[ext]' },
        ]
    },
    resolve: {
        extensions: [
            '.html',
            '.js', '.jsx',
            '.css', '.scss', '.less',
            '.png', '.jpg', '.jpeg', '.gif', '.svg',
            '.woff', '.woff2', '.otf', '.ttf', '.eot'
        ]
    }
};

const bundles = search('^((?!vendor).)*src\/[\\w\/]+Resources$');
bundles.push('app/Resources');

const entries = entrify(bundles);
const alias = aliasify(bundles);

const configs = module.exports = entries.map(entry => assign(entry))
    .map(entry => Object.assign({}, config, entry))
    .map(entry => Object.assign({}, entry, {
        resolve: Object.assign({}, entry.resolve, { alias })
    }));