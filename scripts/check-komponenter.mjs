/**
 * Kontrollerar att komponenterna följer husreglerna.
 *
 * Körs av `npm run check` och i CI vid varje pull request. Meningen är att
 * flytta reglerna i CLAUDE.md från text till rött eller grönt, så att de gäller
 * lika hårt oavsett vem – eller vilken agent – som skrev koden.
 *
 * Tre kontroller:
 *   1. Varje komponentmapp har sina fyra filer.
 *   2. Varje komponent är exporterad från src/index.ts.
 *   3. Inga hårdkodade färger eller pixelvärden i komponentfilerna.
 *
 * Undantag för punkt 3 skrivs som en kommentar på raden ovanför:
 *   // tillåt-hårdkodat: Figma har ingen variabel för den här radien än
 */

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const KOMPONENTER = "src/components";
const INDEX = "src/index.ts";
const UNDANTAG = "tillåt-hårdkodat";

const fel = [];
const varningar = [];

/** Mappar direkt under src/components/, sorterade. */
function komponentmappar() {
  if (!existsSync(KOMPONENTER)) return [];
  return readdirSync(KOMPONENTER)
    .filter((namn) => !namn.startsWith(".") && statSync(join(KOMPONENTER, namn)).isDirectory())
    .sort();
}

/** 1. Fyra filer per mapp. */
function kontrolleraFiler(namn) {
  const mapp = join(KOMPONENTER, namn);
  for (const fil of [`${namn}.tsx`, `${namn}.stories.tsx`, `${namn}.figma.ts`, "index.ts"]) {
    if (!existsSync(join(mapp, fil))) {
      fel.push(`${mapp}/${fil} saknas`);
    }
  }
}

/** 2. Exporterad från det publika API:et. */
function kontrolleraExport(namn, index) {
  if (!index.includes(`./components/${namn}`)) {
    fel.push(`${namn} är inte exporterad från ${INDEX} – utan den syns komponenten inte för konsumenten`);
  }
}

/**
 * 3. Hårdkodade värden i själva komponenten. Stories får innehålla vad som
 * helst; de är demomaterial och hamnar inte i paketet.
 */
const MONSTER = [
  { regex: /#[0-9a-fA-F]{3,8}\b/, vad: "hexfärg" },
  { regex: /\brgba?\s*\(/, vad: "rgb-färg" },
  { regex: /\[[^\]]*\d+(px|rem)[^\]]*\]/, vad: "pixelvärde i en Tailwind-klass" },
];

function kontrolleraVarden(namn) {
  const sokvag = join(KOMPONENTER, namn, `${namn}.tsx`);
  if (!existsSync(sokvag)) return;

  const rader = readFileSync(sokvag, "utf8").split("\n");
  rader.forEach((rad, i) => {
    // var(--npa-…) är hela poängen med tokens och ska aldrig fällas.
    const utanVar = rad.replace(/var\(--[^)]*\)/g, "");
    const foregaende = i > 0 ? rader[i - 1] : "";
    if (foregaende.includes(UNDANTAG)) return;

    for (const { regex, vad } of MONSTER) {
      if (regex.test(utanVar)) {
        fel.push(
          `${sokvag}:${i + 1} innehåller ${vad} – använd en token i stället, ` +
            `eller motivera med "// ${UNDANTAG}: <skäl>" på raden ovanför`,
        );
        break;
      }
    }
  });
}

const mappar = komponentmappar();

if (mappar.length === 0) {
  console.log("Inga komponenter byggda än – inget att kontrollera.");
  process.exit(0);
}

const index = existsSync(INDEX) ? readFileSync(INDEX, "utf8") : "";

for (const namn of mappar) {
  kontrolleraFiler(namn);
  kontrolleraExport(namn, index);
  kontrolleraVarden(namn);
}

for (const rad of varningar) console.warn(`  varning  ${rad}`);

if (fel.length > 0) {
  console.error(`\n${fel.length} problem i ${mappar.length} komponenter:\n`);
  for (const rad of fel) console.error(`  ✗  ${rad}`);
  console.error("");
  process.exit(1);
}

console.log(`${mappar.length} komponenter kontrollerade: ${mappar.join(", ")}. Inga problem.`);
