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

export const sortImportsRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          special: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          order: {
            type: 'array',
            items: {
              enum: [Type.special, Type.namespace, Type.default, Type.defaultObj, Type.obj, Type.none],
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context) => {
    const {
      special: stringSpecial = ['react'],
      order = [Type.special, Type.namespace, Type.default, Type.defaultObj, Type.obj, Type.none],
    } = (context.options[0] as Options) ?? {};

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
