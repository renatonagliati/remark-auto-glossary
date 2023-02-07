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

  // sort glossary by term key
  let glossaryArray = [];
  for(var key in glossaryFileContent) {
    glossaryArray.push(glossaryFileContent[key]);
  }
  glossaryArray.sort(function (a, b) {
    return a.term.localeCompare(b.term);
  });

  // generate schema.org terms list
  let nodeContent = `<div>`;
  for(var key in glossaryArray) {
    let href = false;
    if ( glossaryArray[key].hasOwnProperty('link') ) {
      href = getHref(glossaryArray[key].link);
    }    

    nodeContent += `<div itemscope itemtype="https://schema.org/DefinedTerm">`;
      if ( href !== false ) {
        nodeContent += `<link itemprop="url" href="${href}"/>`;
      }
      nodeContent += `<span itemprop="name"><strong>${glossaryArray[key].term}</strong></span><br/>`;
      nodeContent += `<span itemprop="description">${glossaryArray[key].def}.</span>`;
      if ( glossaryArray[key].hasOwnProperty('link') ) {
        nodeContent += `<br/><div>${glossaryArray[key].link}</div>`;
      }
      nodeContent += `<br/>`;
    nodeContent += `</div>`;
  }
  nodeContent += `</div>`;

  return nodeContent;
};