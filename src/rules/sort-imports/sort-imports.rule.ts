import { Rule } from 'eslint';
import { Options } from './sort-imports.types';
import {
  createSortTable,
  getImports,
  isEmpty,
  getSortedImports,
  reportErrors,
  parseStringSpecial,
} from './sort-imports.utils';
import { Type } from './type.enum';

const defaultOptions = {
  special: ['react'],
  order: [Type.special, Type.namespace, Type.default, Type.defaultObj, Type.obj, Type.none],
};

export const sortImportsRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'code',
    messages: {
      sort: 'Replace imports to: {{imports}}',
    },
    schema: [
      {
        type: 'object',
        description: 'Sort imports options',
        properties: {
          special: {
            type: 'array',
            description: 'List of special import patterns (supports regex strings)',
            items: {
              type: 'string',
            },
          },
          order: {
            type: 'array',
            description: 'Order of import types',
            items: {
              enum: [Type.special, Type.namespace, Type.default, Type.defaultObj, Type.obj, Type.none],
            },
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
  },
  create: (context) => {
    const { special: stringSpecial = defaultOptions.special, order = defaultOptions.order } =
      (context.options[0] as Options) ?? {};

    const special = parseStringSpecial(stringSpecial);

    return {
      Program: (program) => {
        const imports = getImports(program);
        if (isEmpty(imports)) return;

        const sortTable = createSortTable(order);
        const sortedImports = getSortedImports(imports, { special, sortTable });

        reportErrors(context, imports, sortedImports);
      },
    };
  },
};
