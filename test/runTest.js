const Mocha = require('mocha');
const glob = require('glob');
const path = require('path');

const mocha = new Mocha({
  ui: 'tdd',
  color: true,
});

const testsRoot = path.resolve(__dirname, '..');

glob('**/out/test/**/*.test.js', { cwd: testsRoot, absolute: true }, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  files.forEach((file) => mocha.addFile(file));

  mocha.run((failures) => {
    process.exit(failures > 0 ? 1 : 0);
  });
});
