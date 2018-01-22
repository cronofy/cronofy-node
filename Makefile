.PHONY: test

CURRENT_VERSION:=$(shell jq ".version" -r package.json)

all: install

install:
	npm install

test:
	npm test

release: test
	npm publish
	git tag v$(CURRENT_VERSION)
	git push --tags
