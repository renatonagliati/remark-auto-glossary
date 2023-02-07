import * as fs from 'fs'
import yaml from 'js-yaml';

const isEmpty = (fileContent) => {
  return Object.keys(fileContent).length === 0;
}

const isValid = (fileContent) => {
  // Check only the first item
  let contentIsValid = false;
  Object.keys(fileContent).every(key => {
    if ( fileContent[key].hasOwnProperty('term') && fileContent[key].hasOwnProperty('def') ) {
      contentIsValid = true;
    }
    return false; //breaks out
  });
  return contentIsValid;
}

export const yamlFileHandler = (yamlFile) => {
  try {
    const fileContent = yaml.load(fs.readFileSync(yamlFile, 'utf8'), {json: true});
    if ( false === isEmpty(fileContent) ) {
      if ( true === isValid(fileContent) ) {
        return fileContent;
      } else {
        console.log('ERROR: Remark Auto Glossary plugin identified inconsistent record(s) in the file yaml file.');
        console.log('Please, check the file structure and retry to load it.');
        return false;
      }
    }
    console.log('WARNING: Remark Auto Glossary plugin has an empty yaml file.');
    return false;
  } catch (e) {
    console.log('ERROR: Remark Auto Glossary plugin requires a "yamlFile" key with a filepath to the .yml file as a value!');
    return false;
  }
}