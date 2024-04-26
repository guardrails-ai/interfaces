import fs  from 'fs';
import { resolve }  from 'path';

const schema = fs.readFileSync(resolve("./schemas/hub/hyper-bundle.json")).toString();
const definitionsSchema = schema.replace(/\$defs/g, "definitions");
fs.writeFileSync(resolve("./statham-bundle.json"), definitionsSchema);