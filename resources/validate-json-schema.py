import sys
import json
from typing import Dict, List
from rich import print
from jsonschema import Draft202012Validator, ValidationError
from referencing import Registry, jsonschema as jsonschema_ref
    

json_schema_validator = Draft202012Validator(
    {
        "$ref": "https://json-schema.org/draft/2020-12/schema",
    }
)


def validate_schema(filepath: str):
    with open(filepath) as schema_file:
        schema = json.loads(schema_file.read())

    fields: Dict[str, List[str]] = {}
    error: ValidationError
    for error in json_schema_validator.iter_errors(schema):
        fields[error.json_path] = fields.get(error.json_path, [])
        fields[error.json_path].append(error.message)

    if fields:
        print(f"The schema located at {filepath} is not compliant with JSON schema Draft 2020-12!")
        print("Validation Output: \n")
        print(fields)
    else:
        print(f"JSON Schema: {filepath} - Ok")

def main():
    _thisFile, filepath, *rest = sys.argv
    validate_schema(filepath)
main()