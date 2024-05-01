import fs  from 'fs';
import { resolve }  from 'path';
import { JSONSchemaFaker } from "json-schema-faker";
import { faker } from '@faker-js/faker';
import _ from 'lodash';

const {
  upperFirst,
  snakeCase,
  camelCase,
  startCase
} = _;


async function generateData () {
  const hubSchemaFile = fs.readFileSync(resolve('schemas/hub/hyper-bundle.json')).toString();
  const hubSchema = JSON.parse(hubSchemaFile);

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

  const sampleManifest = JSONSchemaFaker.generate(hubSchema);

  console.log(sampleManifest)
}
generateData()