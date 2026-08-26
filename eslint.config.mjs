import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'docs/munganga-ui-prototype/**',
      'node_modules/**',
      'src/routeTree.gen.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.flat['recommended-latest'].rules,
      ...reactRefresh.configs.vite.rules,
      'react-refresh/only-export-components': [
        'error',
        { allowExportNames: ['Route'] },
      ],
    },
  },
  {
    files: ['src/routes/**/*.{js,jsx}'],
    rules: {
      // TanStack Router route modules export `Route` alongside their page
      // component and manage their own HMR boundary through the Vite plugin.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['*.js', 'server/**/*.js', 'scripts/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'commonjs',
    },
    rules: {
      // Convention : un paramètre préfixé par _ est intentionnellement
      // non utilisé pour l'instant (ex. squelettes de services dans
      // appointmentsService.js, en attendant les issues #9-#13).
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]
