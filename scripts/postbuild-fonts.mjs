/**
 * Vite bakar in fontfiler som base64 i lib-läge, vilket gör styles.css nästan
 * en halv megabyte. Det här steget byter ut de inbakade @font-face-reglerna mot
 * riktiga filer i dist/fonts/.
 */
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const CSS = "dist/styles.css";
const FONT_DIR = "src/fonts";

const fonts = readdirSync(FONT_DIR).filter((f) => f.endsWith(".woff2"));
mkdirSync("dist/fonts", { recursive: true });
for (const f of fonts) copyFileSync(`${FONT_DIR}/${f}`, `dist/fonts/${f}`);

let css = readFileSync(CSS, "utf8");
const before = css.length;

// Ta bort varje @font-face som innehåller en inbakad base64-url.
css = css.replace(/@font-face\s*\{[^}]*base64[^}]*\}/g, "");

const fontFaces = fonts
  .map((file) => {
    const weight = { Light: 300, Semilight: 350, Darkmode: 370, "Text-Regular": 400 }[
      file.replace("Cocogoose-Pro-", "").replace(".woff2", "")
    ];
    if (!weight) throw new Error(`Okänd vikt för fontfilen ${file}`);
    return `@font-face{font-family:"Cocogoose Pro";src:url("./fonts/${file}") format("woff2");font-weight:${weight};font-style:normal;font-display:swap}`;
  })
  .join("\n");

writeFileSync(CSS, `${fontFaces}\n${css}`);

const after = readFileSync(CSS, "utf8").length;
console.log(
  `Fonter utbrutna: ${fonts.length} filer till dist/fonts/, styles.css ${Math.round(before / 1024)} kB -> ${Math.round(after / 1024)} kB`,
);
