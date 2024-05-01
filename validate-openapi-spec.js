import fs  from 'fs';
import { resolve }  from 'path';
import { validate } from "@hyperjump/json-schema/openapi-3-1";


async function main () {
  const [
    _execPath,
    _thisFile,
    filepath
  ] = process.argv;

  if (!filepath) throw new Error("A filepath is required as the first argument for this script!");

  const openApiSpec = JSON.parse(
    fs.readFileSync(
      resolve(filepath)
    ).toString()
  );

  console.info("OpenAPI Spec: \n", JSON.stringify(openApiSpec, null, 2))

  const output = await validate("https://spec.openapis.org/oas/3.1/schema-base", openApiSpec, "DETAILED");

  console.info("Validation Output: \n", JSON.stringify(output, null, 2));
  if (output.valid) {
    console.info("Ok")
    process.exit(0);
  } else {
    console.error(`The schema located at ${filepath} is not compliant with OpenAPI Specification 3.1!`);
    process.exit(1);
  }
}
main()