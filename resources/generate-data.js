import fs  from 'fs';
import '@hyperjump/json-schema/draft-2020-12';
import contentTypeParser from 'content-type';
import _ from 'lodash';
import { resolve }  from 'path';
import { addMediaTypePlugin } from '@hyperjump/browser';
import { buildSchemaDocument } from '@hyperjump/json-schema/experimental';
import { JSONSchemaFaker } from "json-schema-faker";
import { faker } from '@faker-js/faker';
import { bundleJsonSchema } from './json-schema-bundler.js'


const {
  upperFirst,
  snakeCase,
  camelCase,
  startCase
} = _;


addMediaTypePlugin('text/plain', {
  parse: async (response) => {
    const contentType = contentTypeParser.parse(response.headers.get('content-type') ?? '');
    const contextDialectId = contentType.parameters.schema ?? contentType.parameters.profile;
    
    const responseBody = JSON.parse(await response.text());
    return buildSchemaDocument(responseBody, response.url, contextDialectId);
  }
});

async function generateData () {

  const manifestSchema = await bundleJsonSchema("https://raw.githubusercontent.com/guardrails-ai/interfaces/litellm_updates/schemas/hub/manifest.json");
  fs.mkdirSync('./build', { recursive: true });
  fs.writeFileSync(resolve('./build/Manifest.json'), JSON.stringify(manifestSchema, null, 2))

  JSONSchemaFaker.format({
    'Sentence case.': () => upperFirst(faker.word.words(3)),
    'email': () => faker.internet.email(),
    'url': () => faker.internet.url(),
    'snake_case': () => snakeCase(faker.word.words(3)),
    'uri': () => faker.internet.url(),
    'regex': () => '.*',
    'camelCase': () => camelCase(faker.word.words(3)),
    'Title Case': () => startCase(faker.word.words(3))
  });

  const sampleManifest = JSONSchemaFaker.generate(manifestSchema);

  console.log(sampleManifest)
}
generateData()