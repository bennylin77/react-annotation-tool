const path = require('path');
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "rules": {
        "no-mixed-spaces-and-tabs": 2,
        "indent": ["error", "tab"],
        "quotes": [
          2,
          "single"
        ],
        "max-len": [2, {"code": 160}],
        "no-tabs": ["error", { "allowIndentationTabs": true }],
        "import/extensions": ["error", "never", {"jsx": "always"}],
        "jsx-quotes": ["error", "prefer-single"],
        "operator-linebreak": ["error", "after"],
        "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
        "react/jsx-indent-props": "off",
        "react/jsx-indent": "off",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-curly-spacing": [2, {"when": "always"}],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",        
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": [
            "error", {
                "devDependencies": [ "./webpack.dev.js", "./webpack.prod.js" ]
            }
        ]
    },
    "settings": {
      "import/resolver": {
        node: {
          paths: [path.resolve(__dirname, 'src')],
        },
      },
    },
    "parser": "babel-eslint"
}
