const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
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
    "no-shadow": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
          "packageDir": [
              "./",
          ],
      },
    ],
    "react/jsx-one-expression-per-line": [
      2,
      {
        "allow": "single-child"
      }
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "react/jsx-filename-extension": [0, { "extensions": [".js", ".jsx"] }],
    '@typescript-eslint/no-var-requires': 'off',
    "linebreak-style": 0,
    "global-require": 0,
    "eslint linebreak-style": [0, "error", "windows"],
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
