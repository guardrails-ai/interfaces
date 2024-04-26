venv:
	rm -rf ./.venv
	python3 -m venv ./.venv

install:
	pip install -r requirements.txt

install-lock:
	pip install -r requirements-lock.txt

lock:
	pip install -r requirements-lock.txt

# can't resolve $defs or definitions, but when given just schemas does the best job of all the tools here
openapi-python-client:
	rm -rf guardrails-hub-types-client
	npm run bundle-openapi-spec
	openapi-python-client generate --path ./hub-openapi-spec.json --meta setup;

# works if $defs are replaced with definitions, but uses internal wrappers like Pydantic does
statham:
	rm -rf ./py
	mkdir -p ./py
	node ./statham-bundler.js
	statham --input ./statham-bundle.json --output ./py/types.py

# doesn't support any $ prefixed properties...
# also doesn't produce any model classes?
autorest:
	npm run bundle-openapi-spec
	node_modules/.bin/autorest --input-file=./hub-openapi-spec.json --python --output-folder=py/

# works if you run it manually, but the classes it produces are garbage
openapi_json_schema_gen:
	openapi_gen -i ./hub-openapi-spec.json -g python -o ./py/oajs_client