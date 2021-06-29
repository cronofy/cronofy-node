
CURRENT_VERSION:=$(shell jq ".version" -r package.json)

all: install

.PHONY: ci
ci: install
	npm ci

.PHONY: install
install:
	npm install

.PHONY: test
test:
	npm test

.PHONY: check_dependencies
check_dependencies:
	@command -v jq >/dev/null || (echo "jq not installed please install via homebrew - 'brew install jq'"; exit 1)

.PHONY: release
release: check_dependencies test
	npm publish
	git tag v$(CURRENT_VERSION)
	git push --tags
	git push
