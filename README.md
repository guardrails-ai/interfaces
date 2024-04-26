# interfaces
Shared interfaces defined in JSON Schema.


## Demo Of Usefulness

### Typescript Types
These can be generated via `npm run bundle-hub-schema && npm run ts-build`.
This file can then be either published as a private module (overkill in my opinion), or copy-pasted into both the validation-hub-service and validation-hub-ui to describe the manifest structures.

### JSON Generation
Obviously more constraints would need to be put in place to generate quality sample data, but the script located at `./generate-data.js` shows a naive approach that can be used to generate sample json objects given a schema and some formatting functions (only required for custom formats).  In this case we're generating a Validator Hub Manifest.

### Python
See how we first use the JSON schemas in an OpenAPI Specification.  Right now, we use some custom code to inject the schemas we want into an empty OpenAPI Spec (see `./openapi-spec-bundler.js`).  We could, when building real specifications, use file references and a dereffer to support this instead (TODO).

Next we use a code generation library, we demonstrate a few different ones in the Makefile, to generate the models and clients.  We currently only care about the models, but the clients could be used in other project such as for the guardrails-api.


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