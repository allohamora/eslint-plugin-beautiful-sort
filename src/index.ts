import { ESLint } from 'eslint';
import { sortImportsRule } from './rules/sort-imports/sort-imports.rule';

const plugin = {
  rules: {
    import: sortImportsRule,
  },
} satisfies ESLint.Plugin;

const configs = {
  recommended: {
    plugins: {
      'beautiful-sort': plugin,
    },
    rules: {
      'beautiful-sort/import': 'error',
    },
  },
} satisfies ESLint.Plugin['configs'];

export = {
  ...plugin,
  configs,
} satisfies ESLint.Plugin;
