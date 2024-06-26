// Regex for individual tooltip: %%Term label|termId%%
const regexp = new RegExp('%%(.*?)\\|(.*?)%%');

const getContent = (glossaryFileContent, termId) => {
  if ( !glossaryFileContent.hasOwnProperty(termId) ) return false;
  
  let tooltipContent = glossaryFileContent[termId].def;
  if ( glossaryFileContent[termId].hasOwnProperty('link') && glossaryFileContent[termId].link != '' )
      tooltipContent += `<br>${glossaryFileContent[termId].link}`;

  return tooltipContent;
};

export const generateTooltip = (glossaryFileContent, node, idx, parent) => {
  const match = node.value.match(regexp)
  // abort if no matches found
  if (!match) return false;
  
  const tooltipStartIndex = match.index
  const tooltipEndIndex = match.index + match[0].length
  const [, label, termId] = match;
  const newChildren = [];

  // abort if not found the tooltip content
  const tooltipContent = getContent(glossaryFileContent, termId);
  if (false === tooltipContent) return false;

  if (tooltipStartIndex !== 0) {
    newChildren.push({
      type: 'text',
      value: node.value.slice(0, tooltipStartIndex),
    })
  }
  // set the tooltip id
  const tooltipId = termId + '_' + idx + '_' + tooltipStartIndex + '_' + Date.now();

  const tooltipTriggerEl =
    {
      type: 'mdxJsxFlowElement',
      name: 'a',
      attributes: [
        { type: 'mdxJsxAttribute', name: 'className', value: 'remark-auto-glossary-tooltip-trigger' },
        { type: 'mdxJsxAttribute', name: 'data-tooltip-id', value: tooltipId },
        { type: 'mdxJsxAttribute', name: 'data-tooltip-html', value: tooltipContent },
        { type: 'mdxJsxAttribute', name: 'data-tooltip-place', value: 'top' },
      ],
      children: [ { type:'text', value: label } ]
    };  
  newChildren.push(tooltipTriggerEl);

  const tooltipNode = {
    type: 'mdxJsxFlowElement',
    name: 'Tooltip',
    attributes: [
      { type: "mdxJsxAttribute", name: "id", value: tooltipId },
      { type: 'mdxJsxAttribute', name: 'place', value: 'top' },
      { type: 'mdxJsxAttribute', name: 'effect', value: 'solid' },      
      { type: "mdxJsxAttribute", name: "clickable" }
    ],
  }
  newChildren.push(tooltipNode);

  if (tooltipEndIndex < node.value.length) {
    newChildren.push({
      type: 'text',
      value: node.value.slice(tooltipEndIndex),
    })
  }

  return newChildren;
};