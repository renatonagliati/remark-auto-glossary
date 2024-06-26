// Regex for glossary: %%RemarkAutoGlossary::list_all%%
const regexp = new RegExp('%%RemarkAutoGlossary::list_all%%');

const getHref = (string) => {
  let href = string.match(/href="([^"]*)/);
  return href !== null ? href[1] : false;
}

export const generateGlossary = (glossaryFileContent, node, idx, parent) => {
  if ('undefined' == typeof node.value) return false;

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
  let newNodes = [];
  for(var key in glossaryArray) {
    let newNode = {
      type: 'mdxJsxTextElement',
      name: 'div',
      attributes: [
        { type: 'mdxJsxAttribute', name: 'className', value: 'remark-auto-glossary-term-details' },
        { type: 'mdxJsxAttribute', name: 'itemScope', value: '' },
        { type: 'mdxJsxAttribute', name: 'itemType', value: 'https://schema.org/DefinedTerm' },
      ],
      children: []
    };
    
    let href = false;
    if ( glossaryArray[key].hasOwnProperty('link') ) {
      href = getHref(glossaryArray[key].link);
    }    

    if ( href !== false ) {
      newNode.children.push(
        {
          type: 'mdxJsxTextElement',
          name: 'link',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'itemProp', value: 'url' },
            { type: 'mdxJsxAttribute', name: 'href', value: href },
          ],
        }
      );
    }

    newNode.children.push(
      {
        type: 'mdxJsxTextElement',
        name: 'div',
        children: [
          {
            type: 'mdxJsxTextElement',
            name: 'span',
            attributes: [{ type: 'mdxJsxAttribute', name: 'itemProp', value: 'name' }],
            children: [
              {
                type: 'mdxJsxTextElement',
                name: 'strong',
                children: [{ type: "text", value: glossaryArray[key].term } ]
              }
            ]
          }            
        ]
      }
    );
    newNode.children.push(
      {
        type: 'mdxJsxTextElement',
        name: 'div',
        children: [
          {
            type: 'mdxJsxTextElement',
            name: 'span',
            attributes: [{ type: 'mdxJsxAttribute', name: 'itemProp', value: 'description' }],
            children: [{ type: "text", value: glossaryArray[key].def } ]
          }            
        ]
      }
    );

    if ( glossaryArray[key].hasOwnProperty('link') ) {
      let linkNode = {
        type: 'mdxJsxTextElement',
        name: 'div',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'className', value: 'more-details' },
        ],
        children: []
      };

      const regexForAnchorTags = /<a\s+href="([^"]*)">(.*?)<\/a>/i;
      const match = glossaryArray[key].link.match(regexForAnchorTags);
      if (match) {
        // Handles html anchor
        const linkHref = match[1];
        const linkLabel = match[2];

        const replaceAnchorTags = (input) => {
          const regex = /<a\s+href="[^"]*">.*?<\/a>/gi;
          return input.replace(regex, '{{{/termlink/');
        };
        
        const maskedLink = replaceAnchorTags(glossaryArray[key].link);
        const stringParts = maskedLink.split('{{{');
        for(let i=0; i < stringParts.length; i++) {
          if ('/termlink/' !== stringParts[i]) {
            linkNode.children.push({ type: "text", value: stringParts[i] });     
          } else {
            linkNode.children.push({ 
              type: 'mdxJsxTextElement',
              name: 'a',
              attributes: [
                { type: 'mdxJsxAttribute', name: 'href', value: linkHref },
              ],
              children: [{ type: "text", value: linkLabel }]
            });
          }
        }
      } else {
        // No html anchor exists
        linkNode.children.push({ type: "text", value: glossaryArray[key].link });
      }

      // Link node
      newNode.children.push(linkNode);
    }
    newNode.children.push(
      {
        type: 'mdxJsxTextElement',
        name: 'br',
      }
    );

    newNodes.push(newNode);
  }

  return newNodes;
};