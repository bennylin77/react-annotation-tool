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
        "react"
    ],
    "rules": {
        "no-mixed-spaces-and-tabs": 2,
        "indent": [2, 4, {"SwitchCase": 1}],
        "quotes": [
          2,
          "single"
        ],
        "react/jsx-indent": "off",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
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
