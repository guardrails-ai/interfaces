install:
	pip install -r requirements.txt;

lock:
	pip freeze --exclude guardrails-api-client > requirements-lock.txt

install-lock:
	pip install -r requirements-lock.txt

env:
	python3 -m venv ./.venv
	source ./.venv/bin/activate && make install-lock


refresh:
	rm -rf ./.venv
	make env