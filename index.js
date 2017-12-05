#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

let options = [`--config=${path.resolve(__dirname, 'config.js')}`];
if (process.env.NODE_ENV == 'prod') options.push(`-p`);
else options.push(`-d`, `--watch`);
spawn('webpack', options, { stdio: 'inherit' });

// const webpack = require('webpack');
// let config = require('./config');

// const assign = item => Object.assign({}, item, 
//     process.env.NODE_ENV != 'prod' ? {
//         devtool: item.devtool || 'cheap-module-eval-source-map',
//         output: Object.assign({ pathinfo: true }, item.output),
//     } : {
//         plugins: (item.plugins || []).concat([
//             new (require('webpack/lib/optimize/UglifyJsPlugin'))({
//                 sourceMap: item.devtool && (item.devtool.indexOf("sourcemap") >= 0 || item.devtool.indexOf("source-map") >= 0)
//             }),
//             new (require('webpack/lib/LoaderOptionsPlugin'))({
//                 minimize: true
//             })
//         ]),
//         stats: 'erros-only',
//     }
// );

// if (Array.isArray(config)) config = config.map(item => assign(item));
// else config = assign(config);

// const compiler = webpack(config);
// const handler = (error, stats) => {
//     if (error) return console.error(error);
//     console.log(stats.toString({
//         chunks: false,
//         colors: true
//     }));
// };

// if (process.env.NODE_ENV == 'prod') {
//     compiler.run(handler);
// } else {
//     const watching = compiler.watch({}, handler);
//     const exit = () => watching && watching.close();
//     process.on('exit', exit);
//     process.on('SIGINT', exit);
// }