'use strict';

const fs = require('fs');
const path = require('path');

// Default folder aliased
const ALIASES = [
    'actions', 'components', 'connecters', 'containers', 'reducers',
    'constants', 'middlewares', 'pages', 'stylesheets', 'utils',
    'fonts', 'images', // 'sounds', 'videos'
];

// Default configuration overloaded with entry, output and alias
const CONFIG = {
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
            '.js', '.jsx',
            '.scss', '.less', '.css',
            '.svg', '.png', '.jpg', '.jpeg', '.gif',
            '.html',
            '.woff', '.woff2', '.otf', '.ttf', '.eot',
        ]
    }
};

// Regexp to know if it's a script which is in bundle folder
const REGEX_SRC = /src\/([\w\/]+)Bundle/;

/**
 * Creates aliases for folder in ALIASES variables if they exists
 * Alias format : @<bundle_name>.<alias>
 * If it's app folder only @<alias>
 * 
 * @param array<string> bundles
 * @return array<string> aliases
 */
const aliasify = (bundles) => {
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

/**
 * Configures entry and output with path of the entry
 * 
 * @param string filepath : Path to entry file
 * @return object config : Contained entry and output field
 */
const configify = (filepath) => {
    const index = filepath.lastIndexOf('/');
    const filename = filepath.slice(index + 1);
    const page_dir = filepath.slice(filepath.indexOf('pages') + 6, index);
    let web_dir = 'web/js';
    if (REGEX_SRC.test(filepath)) web_dir = `web/bundles/${
        filepath.match(REGEX_SRC)[1]
            .replace(/\//g, '_')
            .toLowerCase()
    }/js`;
    const build_dir = path.resolve(__dirname, web_dir, page_dir);
    return {
        entry: filepath,
        output: {
            filename: `${filename.split('.')[0]}.js`,
            path: build_dir
        },
    };
}

/**
 * Browses all files in a folder
 * 
 * @param string filename : path to browse
 * @param boolean folders : specify if folders must be included
 * @return array<string> pathes : array of pathes in filename
 */
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

/**
 * Browses all files in each bundles
 * 
 * @param array<string> bundles : pathes to bundles
 * @return array<string> pathes : pathes to scripts into bundles 
 */
const entrify = (bundles) => {
    const { WEBPACK_ENTRY } = process.env;
    const index = WEBPACK_ENTRY ? WEBPACK_ENTRY.indexOf('/') : undefined;
    let entries = bundles.map(bundle => `${bundle}/pages`);
    if (WEBPACK_ENTRY && index === 0) entries = [WEBPACK_ENTRY];
    else if (WEBPACK_ENTRY) entries = [path.resolve(__dirname, 'app/Resources/pages', WEBPACK_ENTRY)];

    let config = [];
    entries.map(entry => browse(entry))
        .forEach(files => config.push(...files));
    return config;
};

/**
 * Searches for a specific pattern into folder
 * 
 * @param string/regexp name : pattern to search
 * @param string folder : folder in which to search
 */
const search = (name = '', folder = '') => {
    const files = browse(path.resolve(__dirname, folder), true);
    const REGEX_SRC = new RegExp(name);
    return files.filter(filename => REGEX_SRC.test(filename));
};

// Find all bundles which are not in vendor folder
const bundles = search('^((?!vendor).)*src\/[\\w\/]+Resources$');
// Appends app/Resources bundle
bundles.push('app/Resources');

// Retrieves scripts into bundles
const entries = entrify(bundles);
// Creates aliases
const aliases = aliasify(bundles);

// Creates config for each script files
const configs = module.exports = entries.map(entry => configify(entry))
    // Overloads with default configuration
    .map(entry => Object.assign({}, CONFIG, entry))
    // Overloads with aliases
    .map(entry => Object.assign({}, entry, {
        resolve: Object.assign({}, entry.resolve, { 
            alias: Object.assign({}, entry.resolve.alias, aliases) 
        })
    }));