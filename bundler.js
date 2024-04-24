import fs  from 'fs';
import { join, resolve }  from 'path';
import { registerSchema }  from '@hyperjump/json-schema/draft-2020-12';
import { bundle }  from '@hyperjump/json-schema/bundle';

// https://gist.github.com/lovasoa/8691344

// (async function () {
//   const [
//     _execPath,
//     _thisFile,
//     schemaUrl,
//     fileName,
//     subdirectory
//   ] = process.argv[2];
//   const metaSchema = await Bundler.get(schemaUrl);
//   const bundle = await Bundler.bundle(metaSchema);
//   const jsonMetaSchema = { schemas: { JsonSchema: bundle } }
//   const fileContents = JSON.stringify(jsonMetaSchema, null, 2);
//   fs.writeFileSync(join(resolve(`interfaces${subdirectory ? `/${subdirectory}` : ''}`), `./${fileName}.json`), fileContents);
// }());


async function bundleJsonMetaSchema () {
  const jsonMetaSchema = await bundle('https://json-schema.org/draft/2020-12/schema');
  const fileContents = JSON.stringify(jsonMetaSchema, null, 2);
  fs.writeFileSync(join(resolve('schemas/shared'), `./json-schema.json`), fileContents);
}

bundleJsonMetaSchema()