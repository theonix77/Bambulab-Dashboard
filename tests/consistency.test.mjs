import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const current = "1.8.3";
const oldVersions = ["1.3.0","1.4.0","1.5.0","1.6.0","1.6.1","1.6.2","1.6.3","1.7.0","1.7.1","1.8.0","1.8.1","1.8.2"];
const textExt = new Set([".js",".mjs",".md",".json",".yaml",".yml",".svg"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

const files = walk(root).filter((f) => textExt.has(path.extname(f)));
for (const file of files) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const text = fs.readFileSync(file, "utf8");
  assert.doesNotMatch(text, /^(<<<<<<<|=======|>>>>>>>)/m, `merge marker in ${rel}`);
  if (rel !== "CHANGELOG.md" && rel !== "tests/consistency.test.mjs") {
    for (const version of oldVersions) {
      assert.ok(!text.includes(version), `old version ${version} outside CHANGELOG.md in ${rel}`);
    }
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
assert.equal(pkg.version, current);
const js = fs.readFileSync(path.join(root, "Bambulab-Dashboard.js"), "utf8");
assert.ok(js.includes(`const VERSION = "${current}"`));
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
assert.ok(readme.includes(`## Funktionen in v${current}`));
const hero = fs.readFileSync(path.join(root, "docs/images/hero.svg"), "utf8");
assert.ok(hero.includes(`v${current}`));

// Public package must not contain installation-specific entity IDs or developer/test environment names.
assert.doesNotMatch(js, /(?:sensor|camera|switch|light|button|select|number|fan)\.druckraum[_a-z0-9]*/i);
assert.doesNotMatch(js, /(?:sensor|camera|switch|light|button|select|number|fan)\.[a-z0-9_]*(?:x2d|a2l)[a-z0-9_]*/i);
assert.doesNotMatch(js, /markus|fernwald|meshcore|onixserver/i);

// Users must be able to choose which discovered printers are shown; no printer is globally forced.
assert.match(js, /function printerIsVisible\(config, printer\)/);
assert.match(js, /data-field="visible"/);
assert.match(js, /this\._printers\.filter\(\(p\) => printerIsVisible\(this\._config, p\)\)/);

console.log("repository consistency tests: ok");
