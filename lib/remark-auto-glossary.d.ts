export type PluginOptions = {
  yamlFile:string,
};

export type GlossaryFileItem = {
  [k: string]: {
    term:string,
    def:string,
    link?:string,
  }
};
    
export type GlossaryFileContent = GlossaryFileItem;