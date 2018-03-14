module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "ecmaVersion": 2017,
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "curly": "error",
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-multi-spaces": ["error"],
        "keyword-spacing": ["error", { "before": true }],
        "key-spacing": ["error", { "mode": "strict" }],
        "block-spacing": "error",
        "object-curly-spacing": ["error", "always"],
        "space-before-function-paren": ["error", { "anonymous": "never", "named": "never", "asyncArrow": "never" }]
    }
};
