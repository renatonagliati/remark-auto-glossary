
# Remark Auto Glossary

This plugin creates tooltips to show more information about terms listed in a yaml file. It is also possible to generate a glossary in list format containing all the terms present in the Yaml file.


## Installation (for Docusaurus)

On Docusaurus ```package.json``` file, insert the following line inside dependencies section. After that, run ```npm install```:


```bash
  "@renatonagliati/remark-auto-glossary": "https://github.com/renatonagliati/remark-auto-glossary.git",
```

If you want to install this plugin storing it in a local folder outside Docusaurus project, please install ```react-tooltip``` on Docusaurus. For that run:

```bash
  npm install react-tooltip
```


## Configuration (for Docusaurus)
On ```docusaurus.config.js``` file, insert the following line inside remarkPlugins array:

```bash
[(await import("@renatonagliati/remark-auto-glossary")).default, { yamlFile: 'glossary.yml' }]
```

The ```yamFile``` property is required (input the glossary file path).

## Yaml file structure
```bash
api:
  term: API
  def: "Application Programming Interface. Enables different systems to interact with each other programmatically. Two types of APIs are REST APIs (web APIs) and native-library APIs."
  link: See <a href='https://google.com'>What is a REST API?</a>

party:
  term: Party
  def: "The definition for party...."
```

All properties are required, except the ```link```.

The yaml file content must be compliant with https://yaml.org/. If in doubt, it is recommended to validate the file content using https://nodeca.github.io/js-yaml/
## How to use?

- **Tooltip:** ```%%API|api%%```
Use to show a tooltip with details for a term.
*On the left side of the pipe is the text you want to display. On the right side is the ```termId```.*

- **Glossary:** ```%%RemarkAutoGlossary::list_all%%```
Use to show a list containing all terms. **Important**: the glossary list must be alone in a paragraph.
*The list is automatically sorted by ascending order based on term property of yaml file.*


## Customizing the elements styles...
If you want to customize the elements generated by this plugin, you can add a bit of css code on your theme stylesheet:

```css
/* Limit the tooltip width to 300px */
div[role="tooltip"] {
    max-width: 300px;
}

/* Change the anchor text color and decoration */
div[role="tooltip"] a {
    color: #fff;
    text-decoration: underline;
}

/* Change the color of glossary list item name */
div[itemscope][itemtype*="DefinedTerm"] span[itemprop="name"] {
    color: #424295;
}

/* Change the color of glossary list item description */
div[itemscope][itemtype*="DefinedTerm"] span[itemprop="description"] {
  color: #000000;
}

/* Change the color of more details div from glossary list item */
div[itemscope][itemtype*="DefinedTerm"] div.more-details {
  color: #666666;
}
```

## Error messages
- ```ERROR: Remark Auto Glossary plugin requires a "yamlFile" key with a filepath to the .yml file as a value!``` *Failed to read the Yaml file. Please, verify the path on docusaurus.config.js.*


- ```ERROR: Remark Auto Glossary plugin identified inconsistent record(s) in the file yaml file.``` *The Yaml file has inconsistent items. Use the parser https://nodeca.github.io/js-yaml/ to fix it.*

- ```WARNING: Remark Auto Glossary plugin has an empty yaml file.``` *The Yaml file is empty.*