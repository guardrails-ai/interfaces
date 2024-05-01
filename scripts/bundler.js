import fs  from 'fs';
import { join, resolve }  from 'path';
import { registerSchema }  from '@hyperjump/json-schema/draft-2020-12';
import { bundle }  from '@hyperjump/json-schema/bundle';
import _ from 'lodash';


async function* walk (dirName, ignoreList = []) {
  const files = fs.readdirSync(dirName);
  for (const file of files) {
    const filepath = join(dirName, file);
    // console.debug(`Evaluating filepath: ${filepath}`);
    // console.debug(`ignoreList: ${ignoreList}`);
    if (ignoreList.includes(filepath) || filepath.endsWith('index.json')) {
      // console.debug(`Ignoring filepath: ${filepath}...`);
      continue
    };
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      yield* walk(filepath, ignoreList);
    } else if (stats.isFile()) {
      // console.debug("yielding schema from file ", filepath)
      yield fs.readFileSync(resolve(filepath)).toString()
    }
  }
}

function useDefs (property) {
  if (property.$ref) {
    if (_.isString(property.$ref)) {
      // Replace absolute URI's with $def reference
      if (property.$ref.startsWith("https")) {
        property.$ref = `#/$defs/${property.$ref.split("/").at(-1).split(".json").at(0)}`
      } else if (property.$ref.startsWith("meta/")) {
        property.$ref = `#/$defs/${property.$ref.split("meta/").at(-1)}`
      }

      const realtiveRefClosures = property.$ref.split("#");
      if (realtiveRefClosures.length > 2) {
        property.$ref = `#${realtiveRefClosures.join("")}`;
      }

    } else {
      property.$ref = useDefs(property.$ref);
    }
  }

  // This is a hack; some tools don't support dynamicRef's yet
  // if (property.$dynamicRef && property.$dynamicRef === '#meta') {
    // This is what we want to do, but many tools also can't support circular structures 
    // property.$ref = "#/$defs/schema";
    
    // Since most of the dynamicRef's are to say that additionalProperties should be a schema,
    //    we can just remove it and let it be an anonymous object.
    // delete property.$dynamicRef;
  // }
  
  if (property.properties) {
    property.properties = updateRefs(property.properties)
  }
  
  if (property.additionalProperties) {
    property.additionalProperties = useDefs(property.additionalProperties)
  }

  if (property.items) {
    property.items = useDefs(property.items)
  }

  if (property.allOf) {
    property.allOf = property.allOf.map(useDefs)
  }

  if (property.anyOf) {
    property.anyOf = property.anyOf.map(useDefs)
  }

  if (property.oneOf) {
    property.oneOf = property.oneOf.map(useDefs)
  }

  return property;
}

function updateRefs (properties) {
  return Object.fromEntries(
    Object.entries(properties)
      .map(([key, value]) => {
        // if (key === "$dynamicRef") {
        //   return 
        // }
        return [key, useDefs(value)]
      })
  );
}

function updateDefs (schema) {
  return Object.fromEntries(
    Object.entries(schema.$defs)
      .map(([key, value]) => {
        if (key.endsWith(".json")) {
          key = key.split(".json").at(0);
          value.$id = key;
        } else if (key.startsWith("https")) {
          key = key.split("/").at(-1);
          value.$id = key;
        }
        return [key, value];
      })
  );
}

function hoistDefs (schema) {
  const hoistedDefs = Object.values(schema.$defs)
    .reduce((acc, value) => {
      if (value.$defs) {
        Object.entries(value.$defs).forEach(([key, value]) => {
          acc[key] = value;
        });
      }
      return acc;
    }, {});
  return {
    ...hoistedDefs,
    ...schema.$defs
  };
}

async function bundleJsonSchemas (schemaId, srcDir, outputDir, outFile) {
  const outputPath = outputDir != 'schemas' ? `schemas/${outputDir}` : outputDir;
  const outputFile = `${outputPath}/${outFile}`;

  const ignoreList = [outputFile];
  // console.debug("ignoreList: ", ignoreList)
  for await (const schema of walk(srcDir, ignoreList)) {
    const schemaJson = JSON.parse(schema);
    // console.debug('Schema: ', schemaJson.$id)
    // console.debug(schemaJson)
    // console.debug('\n')
    registerSchema(schemaJson, schemaJson.$id);
  }

  let bundledSchema = await bundle(schemaId);
  bundledSchema.$id = schemaId;

  bundledSchema.$defs = hoistDefs(bundledSchema);
  bundledSchema.$defs = updateDefs(bundledSchema);
  bundledSchema.properties = updateRefs(bundledSchema.properties);
  bundledSchema.$defs = updateRefs(bundledSchema.$defs);
  
  fs.writeFileSync(resolve(outputFile), JSON.stringify(bundledSchema, null, 2))
}

async function createIndex () {
  const [
    _execPath,
    _thisFile,
    schemaId,
    srcDir = 'schemas',
    outputDir = 'schemas',
    outFile = 'hyper-bundle.json'
  ] = process.argv;

  if (!schemaId) throw new Error("Schema ID is required as the first argument for this script!");
  if (!srcDir) {
    console.warn("It is highly suggested to pass source directory as the second argument for this script!  Otherwise all schemas will be included as $defs.");
  }
  if (!outputDir) {
    console.warn("It is highly suggested to pass source directory as the second argument for this script!  Otherwise schemas/index.json will be overwritten.");
  }

  bundleJsonSchemas(schemaId, srcDir, outputDir, outFile)
}
createIndex()


