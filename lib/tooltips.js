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

  const tooltipTriggerEl = {
    type: 'html',
    value: `<a id="${tooltipId}" data-tooltip-html="${tooltipContent}" data-tooltip-place="top">${label}</a>`,
  }
  newChildren.push(tooltipTriggerEl);

  const tooltipNode = {
    type: 'jsx',
    value: `<Tooltip anchorId="${tooltipId}" clickable />`,
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