# set environment variables
SHELL := /bin/bash


# sent default make variables
reporter = spec


# set target specific variables
test-fun: reporter = nyan


# define targets
.PHONY: test test-fun test-watch


test:
	@./node_modules/.bin/mocha -u tdd --reporter $(reporter)


test-fun: test


test-watch:
	@./node_modules/.bin/mocha -u tdd --reporter $(reporter) --watch
