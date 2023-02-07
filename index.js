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
        if ( typeof node.children === undefined )
          return;

        node.children.every(node_temp => {
          const glossary = generateGlossary(glossaryFileContent, node_temp, idx, parent);

          if (false !== glossary) {
            node.type = 'html';
            node.value = glossary;
          }          
        });
      });      

      // Import libs
      if (hasTooltips) {
        visit(ast, 'root', (node) => {
          const libImports = [
            "import { Tooltip } from 'react-tooltip'",
            "import 'react-tooltip/dist/react-tooltip.css'"
          ];
          libImports.forEach((item) => {
            node.children.push({
              type: 'import',
              value: item
            });
          }); 
        });
      }
    }

  };

  return transformer;
};