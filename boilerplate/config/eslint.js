module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  env: {
    es6: true,
    browser: true
  },
  extends: 'airbnb',
  plugins: ['compat'],
  rules: {
    'comma-dangle': 0,
    'no-unused-vars': 1,
    'no-unused-expressions': ['error', {
      allowShortCircuit: true,
      allowTernary: true
    }],
    'no-new': 0,
    'no-param-reassign': [2, { props: false }],
    'no-restricted-syntax': 0,
    'guard-for-in': 0,
    'class-methods-use-this': 0,
    'no-console': [0],
    'compat/compat': 2,
    'max-len': ['error', 100, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
  },
  globals: {
    _: false,
    Power1: false,
    Power2: false,
    Power3: false,
    Power4: false,
    Expo: false,
    Circ: false,
    CraftEntry: false,
    grecaptcha: false,
    google: false,
    Garnish: false,
  }
};
