import { ImportDeclaration } from 'estree';
import { SortTable } from './sort-imports.utils';
import { Type } from './type.enum';

const DEFAULT_AST_TYPE = 'ImportDefaultSpecifier';
const OBJ_AST_TYPE = 'ImportSpecifier';
const NAMESPACE_AST_TYPE = 'ImportNamespaceSpecifier';

export interface ImportNodeParams {
  special: RegExp[];
  sortTable: SortTable;
}

export class ImportNode {
  private type: Type | null = null;

  constructor(private node: ImportDeclaration, private params: ImportNodeParams) {
    this.type = this.calculateType();
  }

  private getSpecialNumber(target: ImportNode) {
    return this.params.special.findIndex((regexp) => {
      return regexp.test(target.getImportPath());
    });
  }

  private specialCompare(target: ImportNode) {
    return this.getSpecialNumber(this) - this.getSpecialNumber(target);
  }

  private getSortTableNumber(target: ImportNode) {
    const { sortTable } = this.params;
    const type = target.getType() ?? 'rest';

    return sortTable[type] ?? sortTable.rest;
  }

  private sortTableCompare(target: ImportNode) {
    return this.getSortTableNumber(this) - this.getSortTableNumber(target);
  }

  private isSpecialNode(target: ImportNode) {
    return target.getType() === Type.special;
  }

  public compare(target: ImportNode) {
    if (this.isSpecialNode(this) && this.isSpecialNode(target)) {
      return this.specialCompare(target);
    }

    return this.sortTableCompare(target);
  }

  public getNode() {
    return this.node;
  }

  public getImportPath() {
    return this.node.source.value as string;
  }

  public getType() {
    return this.type;
  }

  private calculateType() {
    switch (true) {
      case this.isSpecial():
        return Type.special;
      case this.isDefault():
        return Type.default;
      case this.isDefaultObj():
        return Type.defaultObj;
      case this.isObj():
        return Type.obj;
      case this.isNamespace():
        return Type.namespace;
      case this.isNone():
        return Type.none;
      default:
        return null;
    }
  }

  private isSpecial() {
    const { node, params } = this;
    const { special } = params;

    return special.some((regexp) => regexp.test(node.source.value as string));
  }

  private isDefault() {
    const { specifiers } = this.node;

    if (!specifiers.length) return false;
    if (specifiers.length > 1) return false;

    return specifiers[0].type === DEFAULT_AST_TYPE;
  }

  private isDefaultObj() {
    const { specifiers } = this.node;
    if (specifiers.length < 2) return false;

    const isFirstDefault = specifiers[0].type === DEFAULT_AST_TYPE;
    const isSecondObj = specifiers[1].type === OBJ_AST_TYPE;

    return isFirstDefault && isSecondObj;
  }

  private isObj() {
    const { specifiers } = this.node;
    if (!specifiers.length) return false;

    return specifiers[0].type === OBJ_AST_TYPE;
  }

  private isNone() {
    return this.node.specifiers.length === 0;
  }

  private isNamespace() {
    if (!this.node.specifiers.length) return false;

    return this.node.specifiers[0].type === NAMESPACE_AST_TYPE;
  }
}
