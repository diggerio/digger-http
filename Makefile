install:
	@npm install

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	--reporter spec \
	--timeout 300 \
	--require should \
	--growl \
	test.js

.PHONY: test install