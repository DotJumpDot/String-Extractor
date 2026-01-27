import * as Mocha from "mocha";
import { glob } from "glob";
import * as path from "path";

const mocha = new Mocha({
  ui: "tdd",
  color: true,
});

const testsRoot = path.resolve(__dirname, "..");

async function runTests() {
  try {
    const files = await glob("**/out/test/**/*.test.js", { cwd: testsRoot, absolute: true });
    files.forEach((file: string) => mocha.addFile(file));

    mocha.run((failures: number) => {
      process.exit(failures > 0 ? 1 : 0);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

runTests();
