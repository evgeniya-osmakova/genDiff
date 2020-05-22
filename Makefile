install:
	npm install

publish:
	npm publish --dry-run

genDiff:
	node bin/genDiff.js

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
