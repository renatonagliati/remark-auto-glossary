import { visit } from 'unist-util-visit';
import { yamlFileHandler } from './lib/utils/yaml-file-handler.js';
import { generateTooltip } from './lib/tooltips.js';
import { generateGlossary } from './lib/glossary.js';

export default function remarkAutoGlossary(options) {

  const transformer = async (ast) => {
    const glossaryFileContent = yamlFileHandler(options.yamlFile);

    if (false !== glossaryFileContent) {
      // Handle tooltips
      let hasTooltips = false;
      visit(ast, 'text', (node, idx, parent) => {
        const tooltipNodes = generateTooltip(glossaryFileContent, node, idx, parent);
        
        // insert into the parent
        if (false !== tooltipNodes) {
          hasTooltips = true;
          parent.children = [
            ...parent.children.slice(0, idx),
            ...tooltipNodes,
            ...parent.children.slice(idx + 1),
          ];
        }
      });

      // Handle glossary list
      visit(ast, 'paragraph', (node, idx, parent) => {
        if ( 'undefined' == typeof node || 'undefined' == typeof node.children )
          return;

        node.children.every(node_temp => {
          const glossary = generateGlossary(glossaryFileContent, node_temp, idx, parent);

          if (false !== glossary) {
            node.type = 'mdxJsxTextElement';
            node.name = 'div';
            node.children = glossary;

          }
        });
      });

      // Import libs
      if (hasTooltips) {
        visit(ast, 'root', (node) => {
          node.children.unshift({
            type: 'mdxjsEsm',
            value: "import { Tooltip } from 'react-tooltip';",
            data: {
              estree: {
                type: 'Program',
                body: [{
                  type: 'ImportDeclaration',
                  specifiers: [{
                    type: 'ImportSpecifier',
                    imported: {
                      type: 'Identifier',
                      name: 'Tooltip'
                    },
                    local: {
                      type: 'Identifier',
                      name: 'Tooltip'
                    }
                  }],
                  source: {
                    type: 'Literal',
                    value: 'react-tooltip'
                  }
                }]
              }
            }
          });

          node.children.unshift({
            type: 'mdxjsEsm',
            value: "import 'react-tooltip/dist/react-tooltip.css';",
            data: {
              estree: {
                type: 'Program',
                body: [{
                  type: 'ImportDeclaration',
                  specifiers: [],
                  source: {
                    type: 'Literal',
                    value: 'react-tooltip/dist/react-tooltip.css'
                  }
                }]
              }
            }
          });

        });
      }      

    }

  };

  return transformer;
};