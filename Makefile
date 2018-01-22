.PHONY: test

CURRENT_VERSION:=$(shell jq ".version" -r package.json)

all: install

install:
	npm install

test:
	npm test

check_dependencies:
	@command -v jq >/dev/null || (echo "jq not installed please install via homebrew - 'brew install jq'"; exit 1)

release: check_dependencies test
	npm publish
	git tag v$(CURRENT_VERSION)
	git push --tags
