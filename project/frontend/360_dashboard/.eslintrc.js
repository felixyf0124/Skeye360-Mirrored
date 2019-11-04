const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  "parserOptions": {
    "jsx": true,
    "useJSXTextNode": true
  },
  "plugins": [
    "react"
  ],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
          "packageDir": [
              "./"
          ]
      }
    ],
    "react/jsx-one-expression-per-line": [
      2,
      {
        "allow": "single-child"
      }
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "react/jsx-filename-extension": [0, { "extensions": [".js", ".jsx"] }]
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            extensions: ['.jsx', '.js', '.tsx', '.ts'],
            modules: ['./', 'node_modules'],
          }
        }
      }
    },
    react:  {
      version:  'detect',
    },
  },
};
