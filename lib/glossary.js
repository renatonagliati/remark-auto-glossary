// Regex for glossary: %%RemarkAutoGlossary::list_all%%
const regexp = new RegExp('%%RemarkAutoGlossary::list_all%%');

const getHref = (string) => {
  let href = string.match(/href="([^"]*)/);
  return href !== null ? href[1] : false;
}

export const generateGlossary = (glossaryFileContent, node, idx, parent) => {
  const match = node.value.match(regexp)
  // abort if no matches found
  if (!match) return false;

  // @todo: sort glossary by term key
  let nodeContent = `<div>`;
  for(var key in glossaryFileContent) {
    let href = false;
    if ( glossaryFileContent[key].hasOwnProperty('link') ) {
      href = getHref(glossaryFileContent[key].link);
    }    

    nodeContent += `<div itemscope itemtype="https://schema.org/DefinedTerm">`;
      if ( href !== false ) {
        nodeContent += `<link itemprop="url" href="${href}"/>`;
      }
      nodeContent += `<span itemprop="name"><strong>${glossaryFileContent[key].term}</strong></span><br/>`;
      nodeContent += `<span itemprop="description">${glossaryFileContent[key].def}.</span>`;
      if ( glossaryFileContent[key].hasOwnProperty('link') ) {
        nodeContent += `<br/><div>${glossaryFileContent[key].link}</div>`;
      }
      nodeContent += `<br/>`;
    nodeContent += `</div>`;
  }
  nodeContent += `</div>`;

  return nodeContent;
};