.PHONY: test
all: install

install:
	npm install

test:
	npm test

release: test
	npm publish
