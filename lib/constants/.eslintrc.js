
let config = module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    parser: "babel-eslint",
    parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
            arrowFunctions: true,
            classes: true,
            impliedStrict: true,
            jsx: true,
            modules: true,
        },
    },
    plugins: [],
    extends: [
        "airbnb-base",
        "eslint:recommended"
    ],
    globals: {
        $: true,
        Color: true,
        Dropzone: true,
        Popper: true,
        bootstrap: true,
        document: true,
        google: true,
        toastr: true,
        window: true,
    },
    settings: {},
    rules: {
        // Basic

        // Optional
        // "max-len": ["warn", { code: 1024, ignoreRegExpLiterals: true, ignoreTrailingComments: true }],
        // "default-case": "off",

        "camelcase": "off",
        "consistent-return": "off",
        "global-require": "off",
        "no-console": ["warn", { "allow": ["warn", "error"]}],
        "no-restricted-syntax": "off",
        "no-return-assign": "off",
        "no-shadow": "off",
        "no-unused-vars": "warn",
        "strict": ["error", "global"],

        // Import
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",
    },
};

try {
    require("react/package.json");
    config.plugins.push("react");
    config.extends.push("plugin:react/recommended");
    Object.assign(config.settings, {
        react: {
            pragma: "React",
            version: "detect",
            flowVersion: "0.53",
        },
        linkComponents: [
            {name: "Link", linkAttribute: "to"}
        ],
    });
    Object.assign(config.rules, {
        // React
        "react/button-has-type": "error",
        "react/default-props-match-prop-types": "error",
        "react/display-name": "off",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/no-unescaped-entities": ["off"],
        "react/prop-types": ["off"],
    });
} catch (e) {}