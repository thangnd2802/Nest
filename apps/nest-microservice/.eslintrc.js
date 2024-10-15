module.exports = {
    extends: ['../../.eslintrc.js'], 
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/domain', 
              from: './src/application', 
              message: 'aaaa',
            },
            {
              target: './src/domain', 
              from: './src', // Prevent importing from Infrastructure
              message: 'aaa',

            },
            {
              target: './src/domain', 
              from: './src/api', // Prevent importing from Interface
            },
          ],
        },
      ],
    },
  };
  