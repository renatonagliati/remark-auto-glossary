import { visit } from 'unist-util-visit';
import { generateTooltip } from './lib/utils/tooltips.js';

export default function remarkAutoGlossary(options) {
  console.log(options);
  
  const transformer = async (ast) => {
    // @todo: parse glossary list
    // Read the file
    // @todo: get file content
    let glossaryFileContent;
    glossaryFileContent = {
      "party": {
        term: "Party",
        def: "Today is the day for Renato's Party and everyone is invited to participate.",
        link: "See <a href='docapis_what_is_a_rest_api.html'>What is a Party?</a>"
      },
      "api": {
        term: "API",
        def: "Application Programming Interface. Enables different systems to interact with each other programmatically. Two types of APIs are REST APIs (web APIs) and native-library APIs.",
        link: "See <a href='docapis_what_is_a_rest_api.html'>What is a REST API?</a>",
      },
    };    

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
          ...parent.children.slice(idx ? idx : 0 + 1),
        ];
      }
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

  };

  return transformer;
};