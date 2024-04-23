const fs = require("fs");
const { join, resolve } = require("path");
const Bundler = require("@hyperjump/json-schema-bundle");


(async function () {
  const [
    _execPath,
    _thisFile,
    schemaUrl,
    fileName,
    subdirectory
  ] = process.argv[2];
  const metaSchema = await Bundler.get(schemaUrl);
  const bundle = await Bundler.bundle(metaSchema);
  const jsonMetaSchema = { schemas: { JsonSchema: bundle } }
  const fileContents = JSON.stringify(jsonMetaSchema, null, 2);
  fs.writeFileSync(join(resolve(`interfaces${subdirectory ? `/${subdirectory}` : ''}`), `./${fileName}.json`), fileContents);
}());