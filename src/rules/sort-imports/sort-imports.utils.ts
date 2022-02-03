import { AST, Rule } from 'eslint';
import { Program, ImportDeclaration } from 'estree';
import { ImportNode, ImportNodeParams } from './import-node';
import { Type } from './type.enum';

const IMPORT_AST_TYPE = 'ImportDeclaration';

export const getImports = (program: Program) => {
  return program.body.filter((node) => node.type === IMPORT_AST_TYPE) as ImportDeclaration[];
};

export const isEmpty = <T>(array: T[]) => {
  return array.length === 0;
};

export type SortTable = {
  [key in Type]?: number;
} & { rest: number };

export const createSortTable = (order: Type[]) => {
  return order.reduce<SortTable>(
    (state, key, idx) => {
      state[key] = idx;

      return state;
    },
    { rest: order.length - 1 },
  );
};

export const getSortedImports = (imports: ImportDeclaration[], params: ImportNodeParams) => {
  return imports
    .map((node) => new ImportNode(node, params))
    .sort((a, b) => a.compare(b))
    .map((importNode) => importNode.getNode());
};

export const reportErrors = (
  context: Rule.RuleContext,
  imports: ImportDeclaration[],
  sortedImports: ImportDeclaration[],
) => {
  const sourceCode = context.getSourceCode();

  for (let i = 0; i < sortedImports.length; i++) {
    const node = sortedImports[i];
    const finded = imports[i];
    const inImportIndex = imports.findIndex((innerNode) => innerNode === node); // compare by object links;

    if (finded !== node) {
      const originalPlace = inImportIndex + 1;
      const newPlace = i + 1;

      context.report({
        message: `${sourceCode.getText(node)} must be ${newPlace}, but it is ${originalPlace}`,
        node: node,
        fix: (fixer) => fixer.replaceTextRange(finded.range as AST.Range, sourceCode.getText(node)),
      });
    }
  }
};

const SLASH = '/';
const START_SLASH_REGEXP = /^\//;
const END_SLASH_REGEXP = /\/$/;

const isRegexp = (target: string) => {
  const isStartsWithSlash = target[0] === SLASH;
  const isEndsWithSlash = target[target.length - 1] === SLASH;

  return isStartsWithSlash && isEndsWithSlash;
};

const specialStringRegexpToRegexp = (specialRegexp: string) => {
  const regexpString = specialRegexp.replace(START_SLASH_REGEXP, '').replace(END_SLASH_REGEXP, '');

  return new RegExp(regexpString);
};

const specialStringToRegexp = (special: string) => {
  return new RegExp(`^${special}$`);
};

export const parseStringSpecial = (stringSpecial: string[]) => {
  return stringSpecial.map((string) => {
    if (isRegexp(string)) {
      return specialStringRegexpToRegexp(string);
    }

    return specialStringToRegexp(string);
  });
};
