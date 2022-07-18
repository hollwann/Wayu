module.exports = {
    env: {
        es2021: true,
        node:true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'sort-keys-fix',
        'sort-imports-es6-autofix',
    ],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        'camelcase':'error',
        'comma-dangle':  [
            'error',
            {
                'arrays': 'always-multiline',
                'exports': 'always-multiline',
                'functions': 'never',
                'imports': 'always-multiline',
                'objects': 'always-multiline',
            },
        ],
        curly: ['error'],
        'linebreak-style': 'off',
        'no-console': 'off',
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'sort-imports-es6-autofix/sort-imports-es6': ['error'],
        'sort-keys-fix/sort-keys-fix': 'error',
    },
}
