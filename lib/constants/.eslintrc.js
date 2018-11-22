
let config = module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "arrowFunctions": true,
            "classes": true,
            "impliedStrict": true,
            "jsx": true,
            "modules": true,
        },
    },
    "plugins": [],
    "extends": [
        "airbnb-base",
        "eslint:recommended"
    ],
    "globals": {
        "$": true,
        "Color": true,
        "Dropzone": true,
        "Popper": true,
        "bootstrap": true,
        "document": true,
        "google": true,
        "toastr": true,
        "window": true,
    },
    "settings": {},
    "rules": {
        // Basic
        "no-console": "warn",
        "no-unused-vars": "warn",
        "strict": ["error", "global"],

        // Import
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",
        "import/extensions": "never",
    },
};

try {
    const react_package = require("react/package.json");
    options.plugins.push("react");
    options.extends.push("plugin:react/recommended")
    Object.assign(options.settings, {
        "react": {
            "pragma": "React",
            "version": react_package.version
        }
    });
    Object.assign(options.rules, {
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