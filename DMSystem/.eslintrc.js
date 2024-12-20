module.exports = {
    root: true,
    env: {
        browser: true, // Enables 'window', 'fetch', etc.
        node: true, // For Node.js-specific code (like setupProxy.js)
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    // Specifies the ESLint parser
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'prettier',
        'prettier/prettier',
        // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended',

        // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    settings: {
        react: {
            version: 'detect', // Automatically detect the React version
        },
    },
    rules: {
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'no-console': 2, // Remember, this means error!  '@typescript-eslint/no-explicit-any': 'off', // Allow `any` type (can be changed to 'warn' or 'error')
        '@typescript-eslint/no-inferrable-types': 'off', // Disable rule that disallows explicitly setting types for primitives when they can be inferred
        'no-unused-vars': ['error', { args: 'none' }],
        '@typescript-eslint/consistent-type-definitions': 'off', // or 'interface'
        'no-case-declarations': 'off', // Disable the rule globally
        'import/order': 'off',
    },
};
