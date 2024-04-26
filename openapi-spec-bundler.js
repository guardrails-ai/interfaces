import fs  from 'fs';
import { resolve }  from 'path';
import _ from 'lodash';


function breakToFix (schema) {  
  return Object.entries(schema)
    .reduce((acc, [key, value]) => {
      if (key !== '$id' && key !== "$schema") {
        if (key === "$defs") {
          key = "definitions"
        } else if (key == "$ref" && _.isString(value)) {
          value = value.startsWith("#/$defs") ?
            value.replace("#/$defs", `#/components/schemas`) :
            value.replace("#/", `#/components/schemas/`)
        }
        if (_.isPlainObject(value)) {
          acc[key] = breakToFix(value);
        } else if (Array.isArray(value) && _.isPlainObject(value.at(0))) {
          acc[key] = value.map(v => breakToFix(v));
        } else {
          acc[key] = value;
        }
      }
      return acc
    }, {});
}

// NOTE: Start with a bundled schema; See ./bundler.js or `npm run bundle-hub-schema`
function hubApiSpec () {
  const schema = JSON.parse(
    fs.readFileSync(resolve("./schemas/hub/hyper-bundle.json")).toString()
  )
  
  const { $defs } = schema;
  delete schema.$defs;

  const schemas = {
    "Manifest": schema,
    ...$defs
  }
  
  const updatedSchemas = breakToFix(
    schemas
  );


  const openApiSpec = {    
    "openapi": "3.0.0",
    "info": {
        "title": "Guardrails Hub Types",
        "version": "0.0.0",
        "description": "Data structures used in the Guardrails Hub"
    },
    "paths": {},
    "components": {
        "schemas": updatedSchemas
    }
  };

  fs.writeFileSync(resolve("./hub-openapi-spec.json"), JSON.stringify(openApiSpec, null, 2));
}
hubApiSpec()