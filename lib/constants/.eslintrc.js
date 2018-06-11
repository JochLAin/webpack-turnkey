const react_package = require('react/package.json');

module.exports = {
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
            "arrowFunctions":true,
            "classes": true,
            "impliedStrict": true,
            "jsx": true,
            "modules":true,
        },
    },
    "plugins": [
        "react",
    ],
    "extends": [
        "airbnb-base",
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "window": true,
        "document": true,
    },
    "settings": {
        "react": {
            "pragma": "React",
            "version": react_package.version
        },
    },
    "rules": {
        // Import
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",
        "import/extensions": "never",

        // React
        "react/button-has-type": "error",
        "react/default-props-match-prop-types": "error",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/prop-types": ["off"],

        "strict": ["error", "global"],
    },
};