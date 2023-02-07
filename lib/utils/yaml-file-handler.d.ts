import type { GlossaryFileContent } from '../remark-auto-glossary';

export const yamlFileHandler:(yamlFile:string) => GlossaryFileContent | false;