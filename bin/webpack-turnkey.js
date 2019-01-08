#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');

const program = require('commander');
const path = require('path');
const package = require(path.resolve(__dirname, '../package.json'));

program
    .usage('[options] <file...>')
    .version(package.version, '-v, --version')
    .option('--bundled', 'Set project directory to current working directory')
    .option('--eslint', 'Enable ESLint')
    .option('--generate', 'Generate structure')
    .option('--sourcemap', 'Enable SourceMap')
    .option('--volatile', 'Set input and output directory to current working directory')
    .allowUnknownOption()
    .parse(process.argv)
;

if (program.bundled) {
    process.env.WEBPACK_TURNKEY_PROJECT_DIR = process.cwd();
}
if (program.volatile) {
    if (program.args.length) {
        process.env.WEBPACK_TURNKEY_OUTPUT_DIR = process.cwd();
        process.env.WEBPACK_TURNKEY_PAGE_DIR = process.cwd();
    }
}

if (!program.generate) {
    if (program.args.length) {
        process.env.WEBPACK_TURNKEY_ENTRY = program.args;
    }
    if (program.eslint) {
        process.env.WEBPACK_TURNKEY_ESLINT = true;
    }
    if (program.sourcemap) {
        process.env.WEBPACK_TURNKEY_SOURCEMAP = true;
    }

    // Parse command options
    const options = require('../lib/options').get();
    if (process.env.NODE_ENV == 'prod') options.push(`-p`);
    else options.push(`-d`);
    
    spawn('npx', ['webpack'].concat(options), {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'inherit'
    });
} else {
    const { copy, exists, mkdir } = require('../lib/utils/file');
    const {
        WEBPACK_TURNKEY_PAGE_DIR,
        WEBPACK_TURNKEY_OUTPUT_DIR,
        WEBPACK_TURNKEY_ASSET_DIR
    } = require('../lib/constants');

    let format = 'minimal';
    if (program.args.length) {
        format = program.args[0];
    }

    const create = (dir) => {
        if (!exists(path.resolve(dir))) {
            mkdir(dir);
        }
    }

    create(WEBPACK_TURNKEY_PAGE_DIR);
    create(WEBPACK_TURNKEY_OUTPUT_DIR);

    const config = require('../templates/config')[format];

    if (config.folders) {
        console.log(`Generate folders for format "${format}"`);
        for (let index in config.folders) {
            create(path.resolve(WEBPACK_TURNKEY_ASSET_DIR, config.folders[index]));
        }
    }

    if (config.modules) {
        console.log(`Install modules for format "${format}"`);
        spawnSync('npm', ['i', '-D'].concat(config.modules), {
            cwd: process.cwd(),
            env: process.env,
            stdio: 'inherit'
        });
    }

    const template_dir = path.resolve(__dirname, '../templates', format);
    if (exists(template_dir)) {
        console.log(`Create files for format "${format}"`);
        copy(path.resolve(template_dir, '*'), WEBPACK_TURNKEY_ASSET_DIR);
    }
}