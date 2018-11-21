
const path = require('path');

// Parse command arguments
module.exports.get = () => {
    // Add webpack configuration file path
    let options = Object.assign({}, require('yargs').argv, {
        config: path.resolve(__dirname, '..', 'config.js')
    });

    // Remove default options
    delete options['$0'];
    delete options['_'];
    delete options['help'];
    delete options['version'];

    delete options['eslint'];
    delete options['sourcemap'];
    delete options['volatile'];

    return ((args) => {
        const reduce = (accu, item) => {
            if (Array.isArray(item)) {
                return accu.concat(item);
            } else {
                return accu.concat([item]);
            }
        }
        const parse = (key, value) => {
            switch (typeof value) {
                case 'undefined':
                    return;
                case 'boolean':
                    if (value) {
                        return `--${key}`;
                    }
                    return `--no-${key}`;
                case 'string':
                case 'number':
                    if (key.length == 1) {
                        return `-${key} ${value}`;                     
                    }
                    return `--${key}=${value}`;
                case 'object':
                    if (Array.isArray(value)) {
                        return value.map(val => parse(key, val)).reduce(reduce, []);
                    } else {
                        const options = [];
                        for (let _key in value) {
                            if (value.hasOwnProperty(_key)) {
                                options.push(parse(`${key}.${_key}`, value[_key]));
                            }
                        }
                        return options.reduce(reduce, []);
                    }
            }
        }

        let options = [];
        for (let key in args) {
            if (args.hasOwnProperty(key)) {
                const opt = parse(key, args[key]);
                options = reduce(options, opt);
            }
        }
        return options;
    })(options);
}
