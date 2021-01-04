const eslint = require('eslint');
const ImportWrap = require('./ImportWrap');
const TYPES = require('./types');

/**
 * @type {eslint.Rule.RuleModule}
 */
const rule = {  
  meta: {
    type: "layout",
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          special: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          order: {
            type: 'array',
            items: {
              enum: [
                TYPES.special,
                TYPES.namespace,
                TYPES.default,
                TYPES.defaultObj,
                TYPES.obj,
                TYPES.none
              ]
            }
          }
        },
        additionalProperties: false,
      }
    ],
  },
  create: context => {
    const options = context.options[0] ?? {};
    
    const special = options.special ?? [
      'react'
    ];

    const order = options.order ?? [
      TYPES.special,
      TYPES.namespace,
      TYPES.default,
      TYPES.defaultObj,
      TYPES.obj,
      TYPES.none
    ];

    return {
      "Program": programNode => {
        const imports = programNode.body.filter(node => node.type === 'ImportDeclaration');
        
        if( imports.length === 0 ) return;

        const importsState = order.reduce((state, type) => {
          state[type] = [];

          return state;
        }, { rest: [] });

        imports.forEach((node, index) => {
          const importWrap = new ImportWrap(node, { special });
          const stateLink = importsState[importWrap.type] ?? importsState.rest;

          stateLink.push({ node, index });
        });

        if( special.length && importsState.special && importsState.special.length > 1 ) {
          const specialState = special.reduce((state, value, i) => {
            state[value] = i;

            return state;
          }, {});

          // mutate importsState.special
          importsState.special.sort((a, b) => {
            const aIndex = specialState[a.node.source.value];
            const bIndex = specialState[b.node.source.value];

            return aIndex - bIndex;
          });
        };

        const sorted = order.reduce((state, key) => [...state, ...importsState[key]], []);

        if( importsState.rest.length ) {
          sorted.push(...importsState.rest);
        };

        const sourceCode = context.getSourceCode();

        sorted.forEach(({ node, index }, i) => {
          const targetNode = imports[i];

          // compare objects
          if( imports[i] !== node ) {
            context.report({
              message: `${sourceCode.getText(node)} must be ${i + 1}, but it is ${index + 1}`,
              node,
              fix: (fixer) => fixer.replaceTextRange(targetNode.range, sourceCode.getText(node))
            });
          }
        })
      }
    }
  }
};

module.exports = rule;