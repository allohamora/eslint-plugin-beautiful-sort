const TYPES = require('./types');

const AST_TYPES = {
  default: 'ImportDefaultSpecifier',
  obj: 'ImportSpecifier',
  namespace: 'ImportNamespaceSpecifier',
}

class ImportWrap {
  type = null;

  constructor(node, params){
    this.setup(node, params);
  }

  setup = (node, { special }) => {
    switch (true) {
      case this.isSpecial(node, special):
        this.type = TYPES.special;
        break;
      case this.isDefault(node):
        this.type = TYPES.default;
        break;
      case this.isDefaultObj(node):
        this.type = TYPES.defaultObj;
        break;
      case this.isObj(node):
        this.type = TYPES.obj;
        break;
      case this.isNamespace(node):
        this.type = TYPES.namespace;
        break;
      case this.isNone(node):
        this.type = TYPES.none;
        break;
      default:
        this.type = null;
        break;
    }
  }

  isSpecial = (node, special) => special.includes(node.source.value);

  isDefault = (node) => {
    const { specifiers } = node;
  
    if( !specifiers.length ) return false;
    if( specifiers.length > 1 ) return false;
  
    return specifiers[0].type === AST_TYPES.default;
  };

  isDefaultObj = (node) => {
    const { specifiers } = node;
    if (specifiers.length < 2 ) return false;
  
    const isHaveDefault = specifiers[0].type === AST_TYPES.default;
    if( !isHaveDefault ) return false;
  
    return specifiers[1].type === AST_TYPES.obj
  };

  isObj = (node) => {
    const { specifiers } = node;
    if (!specifiers.length) return false;
  
    return specifiers[0].type === AST_TYPES.obj
  };

  isNone = (node) => node.specifiers.length === 0;

  isNamespace = (node) => {
    if( !node.specifiers.length ) return;

    return node.specifiers[0].type === AST_TYPES.namespace;
  }
}

module.exports = ImportWrap;
