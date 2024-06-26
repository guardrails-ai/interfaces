# interfaces
Shared interfaces defined in JSON Schema.


## Demo Of Usefulness

### Typescript
We can generate Typescript classes via `npm run ts-build`.
These files can then be either published as a private module, or copy-pasted into any target repositories to describe the manifest structures.

### JSON Generation
Obviously more constraints would need to be put in place to generate quality sample data, but the script located at `./generate-data.js` shows a naive approach that can be used to generate sample json objects given a schema and some formatting functions (only required for custom formats).  In this case we're generating a Validator Hub Manifest.

### Python
See how we first use the JSON schemas in an OpenAPI Specification.  Right now, we use some custom code to inject the schemas we want into an empty OpenAPI Spec (see `./openapi-spec-bundler.js`).  We could, when building real specifications, use file references and a dereffer to support this instead (TODO).

Next we use a code generation library to generate the models and clients.  We currently only care about the models, but the clients could be used in other project such as for the guardrails-api.

The most feature rich generator we've tested so far is [OpenAPITools/openapi-generator](https://github.com/OpenAPITools/openapi-generator).  This requires us to place the schemas within an OpenAPI specification, but chances are this will happen organically as we build API's around our core concepts.  See it's usage via `npm run py-build`


### Other Potential Integrations
#### Docs Generation
https://jy95.github.io/docusaurus-json-schema-plugin/

#### JSON Generation in Python
https://github.com/python-jsonschema/hypothesis-jsonschema

#### JSON Validation against JSON Schema
See an extensive list here: https://json-schema.org/implementations

##### Javascript
@hyperjump/json-schema
ajv

##### Python
json-schema

## TODO
 
 - [ ] Add a github action that uses resources/validate-json-schema.js to validate any schema changes on PR