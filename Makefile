install:
	npm install

publish:
	npm publish --dry-run

genDiff:
	node bin/genDiff.js

make lint:
	npx eslint .

