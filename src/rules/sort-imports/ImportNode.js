const eslint = require('eslint');
const TYPES = require('./types');

const AST_TYPES = {
  default: 'ImportDefaultSpecifier',
  obj: 'ImportSpecifier',
  namespace: 'ImportNamespaceSpecifier',
}

class ImportNode {
  constructor(
    /** @type {eslint.Rule.Node} */
    node, 
    /** @type {{ special: string[] }} */
    params
  ){
    this.node = node;
    this.params = params;

    this.type = this.getType();
  }

  getType = () => {
    switch (true) {
      case this.isSpecial():
        return TYPES.special;
      case this.isDefault():
        return TYPES.default;
      case this.isDefaultObj():
        return TYPES.defaultObj;
      case this.isObj():
        return TYPES.obj;
      case this.isNamespace():
        return TYPES.namespace;
      case this.isNone():
        return TYPES.none;
      default:
        return null;
    }
  }

  isSpecial = () => {
    const { node, params } = this;
    const { special } = params;

    return special.includes(node.source.value);
  };

  isDefault = () => {
    const { specifiers } = this.node;
  
    if( !specifiers.length ) return false;
    if( specifiers.length > 1 ) return false;
  
    return specifiers[0].type === AST_TYPES.default;
  };

  isDefaultObj = () => {
    const { specifiers } = this.node;
    if (specifiers.length < 2) return false;
  
    const isFirstDefault = specifiers[0].type === AST_TYPES.default;
    const isSecondObj = specifiers[1].type === AST_TYPES.obj;
  
    return isFirstDefault && isSecondObj;
  };

  isObj = () => {
    const { specifiers } = this.node;
    if (!specifiers.length) return false;
  
    return specifiers[0].type === AST_TYPES.obj
  };

  isNone = () => {
    return this.node.specifiers.length === 0;
  }

  isNamespace = () => {
    if( !this.node.specifiers.length ) return false;

    return this.node.specifiers[0].type === AST_TYPES.namespace;
  }
}

module.exports = ImportNode;
