
const path = require('path');

module.exports = (argv) => {
    let options = Object.assign({}, argv, {
        config: path.resolve(__dirname, '..', 'config.js')
    });
    delete options['$0'];
    delete options['_'];
    delete options['eslint'];
    delete options['help'];
    delete options['version'];

    return ((args) => {
        const reducer = (accu, item) => {
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
                    if (value) return `--${key}`;
                    return `--no-${key}`;
                case 'string':
                case 'number':
                    if (key.length == 1) return `-${key} ${value}`;                     
                    return `--${key}=${value}`;
                case 'object':
                    if (Array.isArray(value)) {
                        return value.map(val => parse(key, val)).reduce(reducer, []);
                    } else {
                        const options = [];
                        for (let _key in value) {
                            options.push(parse(`${key}.${_key}`, value[_key]));
                        }
                        return options.reduce(reducer, []);
                    }
            }
        }

        let options = [];
        for (let key in args) {
            const opt = parse(key, args[key]);
            options = reducer(options, opt);
        }
        return options;
    })(options);
}
