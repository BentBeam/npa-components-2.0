/**
 * Bygger och (valfritt) publicerar npm-paketet.
 *
 * Detta körs ALDRIG automatiskt. Designsystemet är work in progress – nya
 * komponenter hamnar i Storybook direkt, men i npm-paketet först när någon
 * medvetet kör det här kommandot.
 *
 *   npm run release                    bygg + packa .tgz, ingen versionshöjning
 *   npm run release -- --patch         0.1.0 -> 0.1.1
 *   npm run release -- --minor         0.1.0 -> 0.2.0
 *   npm run release -- --major         0.1.0 -> 1.0.0
 *   npm run release -- --set 0.4.2     sätt exakt version
 *   npm run release -- --minor --publish   höj, bygg och publicera till npm
 *   npm run release -- --dry-run       visa vad som skulle hända
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const dryRun = has("--dry-run");
const publish = has("--publish");

const run = (cmd, cmdArgs) => {
  console.log(`  $ ${cmd} ${cmdArgs.join(" ")}`);
  if (dryRun) return "";
  return execFileSync(cmd, cmdArgs, { stdio: "inherit", encoding: "utf8" });
};

const pkgPath = "package.json";
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const from = pkg.version;

/** Räknar ut ny version utifrån flaggorna. */
function nextVersion() {
  const setIndex = args.indexOf("--set");
  if (setIndex !== -1) {
    const value = args[setIndex + 1];
    if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(value ?? "")) {
      throw new Error(`--set behöver en giltig version, fick: ${value}`);
    }
    return value;
  }
  const [major, minor, patch] = from.split(".").map(Number);
  if (has("--major")) return `${major + 1}.0.0`;
  if (has("--minor")) return `${major}.${minor + 1}.0`;
  if (has("--patch")) return `${major}.${minor}.${patch + 1}`;
  return from;
}

const to = nextVersion();

console.log(`\n${pkg.name}`);
console.log(`Version: ${from}${to === from ? " (oförändrad)" : ` -> ${to}`}`);
if (dryRun) console.log("DRY RUN – inga filer skrivs, inget publiceras.\n");

// Varna om det finns ocommittade ändringar, men blockera inte.
try {
  const status = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim();
  if (status) console.warn(`\nVarning: git-trädet är inte rent (${status.split("\n").length} ändrade filer).`);
} catch {
  // Inget git-repo – strunt samma.
}

if (to !== from && !dryRun) {
  pkg.version = to;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

console.log("\nGenererar ikoner:");
run("node", ["scripts/generate-icons.mjs"]);

console.log("\nTypkontroll:");
run("npx", ["tsc", "-p", "tsconfig.json", "--noEmit"]);

console.log("\nBygger paketet:");
run("npm", ["run", "build"]);

if (!dryRun) {
  const dist = readdirSync("dist");
  for (const required of ["index.js", "index.d.ts", "styles.css"]) {
    if (!dist.includes(required)) throw new Error(`Bygget saknar dist/${required}`);
  }
  console.log(`\ndist/ innehåller: ${dist.join(", ")}`);
}

if (publish) {
  console.log("\nPublicerar till npm:");
  // Scopade paket är privata som standard – --access public krävs.
  run("npm", ["publish", "--access", "public"]);
  console.log(`\nKlart. ${pkg.name}@${to} är publicerat.`);
  console.log("Nästa steg: publicera Code Connect med `npm run figma:publish`.");
} else {
  console.log("\nPackar tarball:");
  run("npm", ["pack"]);
  console.log("\nKlart – en .tgz ligger i repo-roten. Inget är publicerat.");
  console.log("Lägg till --publish när paketet ska ut på npm.");
}
