
const { spawn } = require('child_process');
const path = require('path');

spawn('npm', ['i'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
}).once('exit', (code) => {
    if (code != 0) process.exit(code);

    spawn('npm', ['i','--no-save', 'webpack', 'webpack-cli', 'react', 'react-dom'], {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'inherit'
    }).once('exit', (code) => {
        if (code != 0) process.exit(code);

        spawn('node', [
            path.resolve('index.js'),
            '--eslint',
            '--sourcemap',
            '--input-dir=tests/assets',
            '--output-dir=tests/public'
        ], {
            cwd: process.cwd(),
            env: Object.assign({}, process.env, {
                ASSET_DIR: path.resolve(__dirname, 'assets'),
                PUBLIC_DIR: path.resolve(__dirname, 'public'),
            }),
            stdio: 'inherit'
        }).once('exit', (code) => {
            if (code != 0) process.exit(code);
        });
    });
});