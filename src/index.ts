import { ESLint } from 'eslint';
import { sortImportsRule } from './rules/sort-imports/sort-imports.rule';

const plugin: ESLint.Plugin = {
  rules: {
    import: sortImportsRule,
  },
};

plugin.configs = {
  recommended: {
    plugins: {
      'beautiful-sort': plugin,
    },
    rules: {
      'beautiful-sort/import': 'error',
    },
  },
};

export = plugin;
